import type { HttpContext } from '@adonisjs/core/http'
import Module from '#models/module'
import { createModuleValidator, updateModuleValidator } from '#validators/module'

export default class ModulesController {
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createModuleValidator)
    
    try {
      await Module.create(payload)
      session.flash('success', 'Module pédagogique ajouté avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de l'ajout du module : " + error.message)
      return response.redirect().back()
    }
  }

  async update({ params, request, response, session }: HttpContext) {
    const moduleItem = await Module.findOrFail(params.id)
    const payload = await request.validateUsing(updateModuleValidator)

    try {
      moduleItem.merge(payload)
      await moduleItem.save()
      session.flash('success', 'Module mis à jour avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de la mise à jour : " + error.message)
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const moduleItem = await Module.findOrFail(params.id)
      await moduleItem.delete()

      session.flash('success', 'Module supprimé avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de la suppression : " + error.message)
      return response.redirect().back()
    }
  }
}
