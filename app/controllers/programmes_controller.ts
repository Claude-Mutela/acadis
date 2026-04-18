import type { HttpContext } from '@adonisjs/core/http'
import Program from '#models/program'
import ProgramCategory from '#models/program_category'

export default class ProgrammesController {
  async index({ inertia }: HttpContext) {
    const programs = await Program.query().preload('category').orderBy('createdAt', 'desc')
    const categories = await ProgramCategory.query().orderBy('name', 'asc')
    
    return inertia.render('administration/programmes/index', { 
      programs, 
      categories 
    })
  }
}
