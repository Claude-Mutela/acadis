import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'

export default class UsersController {
  /**
   * GET /administration/utilisateurs
   */
  async index({ inertia }: HttpContext) {
    //afficher les données liées au profil de l'utilisateur
    const users = await User.query().preload('profile').orderBy('createdAt', 'desc')
    return inertia.render('administration/users/index', { users })
  }

  /**
   * POST /administration/utilisateurs
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)

    // Le mot de passe est automatiquement hashé par withAuthFinder (via le hook beforeSave)
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      status: data.status,
    })

    session.flash('success', 'Utilisateur créé avec succès !')
    return response.redirect().toRoute('admin.users.index')
  }

  /**
   * PUT /administration/utilisateurs/:id
   */
  async update({ params, request, session, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['firstName', 'lastName', 'email', 'role', 'status'])
    user.merge(data)
    await user.save()
    session.flash('success', 'Utilisateur modifié avec succès !')
    return response.redirect().toRoute('admin.users.index')
  }

  /**
   * DELETE /administration/utilisateurs/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    session.flash('success', 'Utilisateur supprimé avec succès !')
    return response.redirect().toRoute('admin.users.index')
  }
}