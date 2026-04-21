import type { HttpContext } from '@adonisjs/core/http'
import Vacation from '#models/vacation'
import { vacationValidator } from '#validators/vacation'

export default class VacationsController {
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(vacationValidator)
    
    try {
      // 1. Création de la vacation liée à la cohorte
      const vacation = await Vacation.create({
        cohortId: payload.cohortId,
        day: payload.day,
        startTime: payload.startTime,
        endTime: payload.endTime
      })

      // 2. Attacher le(s) programme(s) via la table pivot
      await vacation.related('programs').sync([payload.programId])

      session.flash('success', 'Vacation programmée avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de l'enregistrement de la vacation : " + error.message)
      return response.redirect().back()
    }
  }

  async update({ params, request, response, session }: HttpContext) {
    const vacation = await Vacation.findOrFail(params.id)
    const payload = await request.validateUsing(vacationValidator)

    try {
      // 1. Mise à jour temporelle et cohorte
      vacation.cohortId = payload.cohortId
      vacation.day = payload.day
      vacation.startTime = payload.startTime
      vacation.endTime = payload.endTime
      await vacation.save()

      // 2. Synchroniser le programme
      await vacation.related('programs').sync([payload.programId])

      session.flash('success', 'Vacation mise à jour avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de la mise à jour : " + error.message)
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const vacation = await Vacation.findOrFail(params.id)
      await vacation.delete() // La suppression en cascade s'occupe de la table pivot

      session.flash('success', 'Vacation supprimée avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de la suppression : " + error.message)
      return response.redirect().back()
    }
  }
}
