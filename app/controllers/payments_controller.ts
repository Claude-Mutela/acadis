import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import User from '#models/user'
import Manuel from '#models/manuel'
import ManualPurchase from '#models/manual_purchase'
import db from '@adonisjs/lucid/services/db'

export default class PaymentsController {
  async index({ inertia }: HttpContext) {
    const payments = await Payment.query()
      .preload('user')
      .preload('invoice')
      .orderBy('createdAt', 'desc')

    // Fetch ManualPurchases separately because relationship might be complex via ManualPurchase
    const manualPurchases = await ManualPurchase.query().preload('manuel')
    
    // Map payments to include manual info for the frontend
    const serializedPayments = payments.map((p) => {
      const mp = manualPurchases.find((m) => m.paymentId === p.id)
      return {
        id: p.id,
        etudiant: p.user?.fullName || 'Inconnu',
        manuel: mp?.manuel?.title || 'N/A',
        montant: Number(p.amount),
        methode: p.paymentType === 'cash' ? 'Cash' : p.paymentType === 'mobile_money' ? 'Mobile Money' : 'Card',
        statut: p.status === 'completed' ? 'Complet' : 'Acompte',
        date: p.createdAt?.toFormat('dd LLL yyyy') || '',
        userId: p.userId,
        manuelId: mp?.manuelId
      }
    })

    const students = await User.query().where('role', 'student').orderBy('firstName', 'asc')
    const manuals = await Manuel.query().orderBy('title', 'asc')

    return inertia.render('administration/paiements/index', {
      initialPayments: serializedPayments,
      studentsList: students.map(s => ({ id: s.id, nom: s.lastName, prenom: s.firstName })),
      manuelsList: manuals.map(m => ({ id: m.id, title: m.title, price: m.price }))
    })
  }

  async store({ request, response, session }: HttpContext) {
    const { userId, manuelId, montant } = request.only(['userId', 'manuelId', 'montant'])

    const student = await User.find(userId)
    const manuel = await Manuel.find(manuelId)

    if (!student || !manuel) {
      session.flash('error', 'Étudiant ou manuel introuvable.')
      return response.redirect().back()
    }

    if (montant > manuel.price) {
      session.flash('error', `Le montant (${montant} $) ne peut pas être supérieur au prix du manuel (${manuel.price} $).`)
      return response.redirect().back()
    }

    await db.transaction(async (trx) => {
      const payment = new Payment()
      payment.userId = userId
      payment.programId = manuel.programId // Required field in migration
      payment.amount = montant.toString()
      payment.paymentType = 'cash'
      payment.status = montant < manuel.price ? 'pending' : 'completed' // Acompte if less than price
      payment.reference = `REF-${Date.now()}`
      payment.useTransaction(trx)
      await payment.save()

      const mp = new ManualPurchase()
      mp.userId = userId
      mp.manuelId = manuelId
      mp.paymentId = payment.id
      mp.useTransaction(trx)
      await mp.save()
    })

    session.flash('success', 'Paiement enregistré avec succès.')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const { montant } = request.only(['montant'])
    const payment = await Payment.find(params.id)

    if (!payment) {
      session.flash('error', 'Paiement introuvable.')
      return response.redirect().back()
    }

    const mp = await ManualPurchase.findBy('paymentId', payment.id)
    if (mp) {
        await mp.load('manuel')
        if (montant > mp.manuel.price) {
            session.flash('error', `Le montant ne peut pas être supérieur au prix du manuel (${mp.manuel.price} $).`)
            return response.redirect().back()
        }
    }

    payment.amount = montant.toString()
    // Update status based on amount if we have the manual
    if (mp) {
        payment.status = montant < mp.manuel.price ? 'pending' : 'completed'
    }
    
    await payment.save()

    session.flash('success', 'Paiement mis à jour avec succès.')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const payment = await Payment.find(params.id)
    if (payment) {
      await payment.delete()
      session.flash('success', 'Paiement supprimé avec succès.')
    }
    return response.redirect().back()
  }
}
