import type { HttpContext } from '@adonisjs/core/http'
import ProgramCategory from '#models/program_category'
import { createProgramCategoryValidator, updateProgramCategoryValidator } from '#validators/program_category'

export default class ProgramCategoriesController {
  /**
   * La méthode index est gérée par ProgrammesController qui regroupe les données
   */

  /**
   * POST /administration/programmes/categories
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createProgramCategoryValidator)
    await ProgramCategory.create(data)

    session.flash('success', 'Catégorie créée avec succès !')
    return response.redirect().back()
  }

  /**
   * PUT /administration/programmes/categories/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const category = await ProgramCategory.findOrFail(params.id)
    const data = await request.validateUsing(updateProgramCategoryValidator)
    
    category.merge(data)
    await category.save()

    session.flash('success', 'Catégorie mise à jour avec succès !')
    return response.redirect().back()
  }

  /**
   * DELETE /administration/programmes/categories/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const category = await ProgramCategory.findOrFail(params.id)
    await category.delete()

    session.flash('success', 'Catégorie supprimée avec succès !')
    return response.redirect().back()
  }
}
