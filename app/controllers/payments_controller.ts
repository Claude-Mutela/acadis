import type { HttpContext } from '@adonisjs/core/http'

export default class PaymentsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('administration/paiements/index', {})
  }

  async store({ response, session }: HttpContext) {
    // TODO: logique de création de paiement
    session.flash('success', 'Paiement enregistré avec succès.')
    return response.redirect().back()
  }

  async update({ response, session }: HttpContext) {
    // TODO: logique de mise à jour de paiement
    session.flash('success', 'Paiement mis à jour avec succès.')
    return response.redirect().back()
  }

  async destroy({ response, session }: HttpContext) {
    // TODO: logique de suppression de paiement
    session.flash('success', 'Paiement supprimé avec succès.')
    return response.redirect().back()
  }
}
