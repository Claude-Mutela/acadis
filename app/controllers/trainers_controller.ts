import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Trainer from '#models/trainer'
import { createTrainerValidator, updateTrainerValidator } from '#validators/trainer'
import db from '@adonisjs/lucid/services/db'

export default class TrainersController {
  /**
   * GET /administration/formateurs
   */
  async index({ inertia }: HttpContext) {
    const trainers = await Trainer.query().preload('user').orderBy('createdAt', 'desc')
    return inertia.render('administration/formateurs/index', { trainers })
  }

  /**
   * POST /administration/formateurs
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createTrainerValidator)

    await db.transaction(async (trx) => {
      // 1. Créer le compte Utilisateur
      const user = new User()
      user.firstName = data.firstName
      user.lastName = data.lastName
      user.email = data.email
      user.password = 'Acadis2024!' // Mot de passe par défaut
      user.role = 'trainer'
      user.status = 'active'
      user.useTransaction(trx)
      await user.save()

      // 2. Créer le profil Formateur
      const trainer = new Trainer()
      trainer.userId = user.id
      trainer.firstName = data.firstName
      trainer.lastName = data.lastName
      trainer.gender = data.gender
      trainer.title = data.title
      trainer.homeChurch = data.homeChurch
      trainer.specialization = data.specialization
      trainer.useTransaction(trx)
      await trainer.save()
    })

    session.flash('success', 'Formateur et compte utilisateur créés avec succès !')
    return response.redirect().toRoute('admin.formateurs.index')
  }

  /**
   * PUT /administration/formateurs/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const trainer = await Trainer.findOrFail(params.id)
    const user = await User.findOrFail(trainer.userId)
    
    const { email, ...trainerData } = await request.validateUsing(updateTrainerValidator)

    await db.transaction(async (trx) => {
      // Mettre à jour l'utilisateur
      user.useTransaction(trx)
      user.merge({
        firstName: trainerData.firstName,
        lastName: trainerData.lastName,
        email: email,
      })
      await user.save()

      // Mettre à jour le formateur
      trainer.useTransaction(trx)
      trainer.merge(trainerData)
      await trainer.save()
    })

    session.flash('success', 'Profil du formateur mis à jour avec succès !')
    return response.redirect().toRoute('admin.formateurs.index')
  }

  /**
   * DELETE /administration/formateurs/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const trainer = await Trainer.findOrFail(params.id)
    const user = await User.findOrFail(trainer.userId)

    await db.transaction(async (trx) => {
      trainer.useTransaction(trx)
      await trainer.delete()

      user.useTransaction(trx)
      await user.delete()
    })

    session.flash('success', 'Formateur et compte utilisateur supprimés avec succès !')
    return response.redirect().toRoute('admin.formateurs.index')
  }
}
