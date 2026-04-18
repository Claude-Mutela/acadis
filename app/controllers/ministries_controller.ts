import type { HttpContext } from '@adonisjs/core/http'
import Ministries from '#models/department'
import { createMinistriesValidator } from '#validators/ministry'

export default class MinistriesController {
    /**
     * GET /administration/ministeres
     */
    async index({ inertia }: HttpContext) {
        const ministries = await Ministries.query().orderBy('name', 'asc')
        return inertia.render('administration/ministeres/index', { ministries })
    }

    /**
     * POST /administration/ministeres
     */
    async store({ request, response, session }: HttpContext) {
        const data = await request.validateUsing(createMinistriesValidator)
        await Ministries.create(data)
        session.flash('success', 'Ministère créé avec succès !')
        return response.redirect().toRoute('admin.ministeres.index')
    }

    /**
     * PUT /administration/ministeres/:id
     */
    async update({ params, request, response, session }: HttpContext) {
        const ministry = await Ministries.findOrFail(params.id)
        const data = await request.validateUsing(createMinistriesValidator)
        ministry.merge(data)
        await ministry.save()
        session.flash('success', 'Ministère modifié avec succès !')
        return response.redirect().toRoute('admin.ministeres.index')
    }

    /**
     * DELETE /administration/ministeres/:id
     */
    async destroy({ params, response, session }: HttpContext) {
        const ministry = await Ministries.findOrFail(params.id)
        await ministry.delete()
        session.flash('success', 'Ministère supprimé avec succès !')
        return response.redirect().toRoute('admin.ministeres.index')
    }
}
