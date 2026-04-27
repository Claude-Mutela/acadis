import type { HttpContext } from '@adonisjs/core/http'

export default class PresencesController {
  async index({ inertia }: HttpContext) {
    return inertia.render('administration/presences', {})
  }
}
