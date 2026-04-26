import type { HttpContext } from '@adonisjs/core/http'
import Planning from '#models/planning'
import Cohort from '#models/cohort'
import { planningValidator } from '#validators/planning'

export default class PlanningsController {
  async index({ inertia }: HttpContext) {
    const plannings = await Planning.query()
      .preload('cohorts', (query) => {
        query.preload('programs')
      })
      .withCount('enrollments', (query) => {
        query.whereIn('status', ['pending', 'confirmed'])
      })
      .orderBy('created_at', 'desc')
    
    const allCohorts = await Cohort.query().preload('programs').orderBy('name', 'asc')

    const formattedPlannings = plannings.map(p => {
      const cohort = p.cohorts.length > 0 ? p.cohorts[0] : null
      
      return {
        id: p.id,
        cohortId: cohort?.id,
        programme: cohort && cohort.programs && cohort.programs.length > 0 ? cohort.programs.map(prog => prog.name).join(', ') : 'Aucun programme',
        cohorte: cohort?.name || 'Aucune cohorte',
        dateDebut: p.startDate ? p.startDate.toISODate() : null,
        dateFin: p.endDate ? p.endDate.toISODate() : null,
        type: p.type,
        placesTotales: p.capacity,
        placesReservees: Number(p.$extras.enrollments_count) || 0,
        statut: p.status
      }
    })

    const formattedCohorts = allCohorts.map(c => ({
      id: c.id,
      name: c.name,
      programs: c.programs && c.programs.length > 0 ? c.programs.map(p => p.name).join(', ') : ''
    }))

    return inertia.render('administration/planning/index', {
      plannings: formattedPlannings,
      cohorts: formattedCohorts
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(planningValidator)
    
    const planning = await Planning.create({
      startDate: payload.startDate,
      endDate: payload.endDate,
      type: payload.type,
      capacity: payload.capacity,
      status: payload.status
    })

    await planning.related('cohorts').attach([payload.cohortId])

    session.flash('success', 'La session a été planifiée avec succès.')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const planning = await Planning.findOrFail(params.id)
    const payload = await request.validateUsing(planningValidator)
    
    planning.merge({
      startDate: payload.startDate,
      endDate: payload.endDate,
      type: payload.type,
      capacity: payload.capacity,
      status: payload.status
    })
    await planning.save()

    await planning.related('cohorts').sync([payload.cohortId])

    session.flash('success', 'La session a été mise à jour avec succès.')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const planning = await Planning.findOrFail(params.id)
    await planning.delete()
    
    session.flash('success', 'La session a été supprimée avec succès.')
    return response.redirect().back()
  }
}