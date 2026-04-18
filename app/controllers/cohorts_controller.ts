import type { HttpContext } from '@adonisjs/core/http'
import { createCohortValidator } from '#validators/cohort'
import Cohort from '#models/cohort'

export default class CohortsController {
    async index({ inertia }: HttpContext) {
        const cohorts = await Cohort.all()
        return inertia.render('administration/cohortes/index', { cohorts })
    }

    async store({ request, session, response }: HttpContext) {
        const data = await request.validateUsing(createCohortValidator)
        await Cohort.create(data)
        session.flash('success', 'Cohorte créée avec succès !')
        return response.redirect().toRoute('admin.cohortes.index')
    }

    async update({ request, response, session, params }: HttpContext) {
        const cohort = await Cohort.findOrFail(params.id)
        const data = await request.validateUsing(createCohortValidator)
        cohort.merge(data)
        await cohort.save()
        session.flash('success', 'Cohorte modifiée avec succès !')
        return response.redirect().toRoute('admin.cohortes.index')
    }

    async destroy({ response, session, params }: HttpContext) {
        const cohort = await Cohort.findOrFail(params.id)
        await cohort.delete()
        session.flash('success', 'Cohorte supprimée avec succès !')
        return response.redirect().toRoute('admin.cohortes.index')
    }
}