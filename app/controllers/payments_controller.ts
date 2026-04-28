import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import User from '#models/user'
import Manuel from '#models/manuel'
import ManualPurchase from '#models/manual_purchase'
import PaymentHistory from '#models/payment_history'
import db from '@adonisjs/lucid/services/db'

export default class PaymentsController {
  async index({ inertia }: HttpContext) {
    const payments = await Payment.query()
      .preload('user')
      .preload('invoice')
      .orderBy('createdAt', 'desc')

    const manualPurchases = await ManualPurchase.query().preload('manuel')
    
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

  async store({ auth, request, response, session }: HttpContext) {
    const { userId, manuelId, montant } = request.only(['userId', 'manuelId', 'montant'])
    const admin = auth.user!

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
      payment.programId = manuel.programId
      payment.amount = montant.toString()
      payment.paymentType = 'cash'
      payment.status = montant < manuel.price ? 'pending' : 'completed'
      payment.reference = `REF-${Date.now()}`
      payment.useTransaction(trx)
      await payment.save()

      const mp = new ManualPurchase()
      mp.userId = userId
      mp.manuelId = manuelId
      mp.paymentId = payment.id
      mp.useTransaction(trx)
      await mp.save()

      // Record History
      const history = new PaymentHistory()
      history.paymentId = payment.id
      history.studentName = student.fullName
      history.manuelTitle = manuel.title
      history.amount = montant
      history.paymentType = 'cash'
      history.status = payment.status
      history.recordedById = admin.id
      history.recordedByName = admin.fullName
      history.actionType = 'CREATE'
      history.useTransaction(trx)
      await history.save()
    })

    session.flash('success', 'Paiement enregistré avec succès.')
    return response.redirect().back()
  }

  async update({ auth, params, request, response, session }: HttpContext) {
    const { montant } = request.only(['montant'])
    const admin = auth.user!
    const payment = await Payment.query().where('id', params.id).preload('user').first()

    if (!payment) {
      session.flash('error', 'Paiement introuvable.')
      return response.redirect().back()
    }

    const mp = await ManualPurchase.query().where('paymentId', payment.id).preload('manuel').first()
    
    if (mp && montant > mp.manuel.price) {
        session.flash('error', `Le montant ne peut pas être supérieur au prix du manuel (${mp.manuel.price} $).`)
        return response.redirect().back()
    }

    await db.transaction(async (trx) => {
        payment.amount = montant.toString()
        if (mp) {
            payment.status = montant < mp.manuel.price ? 'pending' : 'completed'
        }
        payment.useTransaction(trx)
        await payment.save()

        // Record History
        const history = new PaymentHistory()
        history.paymentId = payment.id
        history.studentName = payment.user?.fullName || 'Inconnu'
        history.manuelTitle = mp?.manuel?.title || 'N/A'
        history.amount = montant
        history.paymentType = payment.paymentType
        history.status = payment.status
        history.recordedById = admin.id
        history.recordedByName = admin.fullName
        history.actionType = 'UPDATE'
        history.useTransaction(trx)
        await history.save()
    })

    session.flash('success', 'Paiement mis à jour avec succès.')
    return response.redirect().back()
  }

  async destroy({ auth, params, response, session }: HttpContext) {
    const admin = auth.user!
    const payment = await Payment.query().where('id', params.id).preload('user').first()
    
    if (!payment) {
      session.flash('error', 'Paiement introuvable.')
      return response.redirect().back()
    }

    const mp = await ManualPurchase.query().where('paymentId', payment.id).preload('manuel').first()

    await db.transaction(async (trx) => {
        // Record History before deletion
        const history = new PaymentHistory()
        history.paymentId = payment.id
        history.studentName = payment.user?.fullName || 'Inconnu'
        history.manuelTitle = mp?.manuel?.title || 'N/A'
        history.amount = Number(payment.amount)
        history.paymentType = payment.paymentType
        history.status = payment.status
        history.recordedById = admin.id
        history.recordedByName = admin.fullName
        history.actionType = 'DELETE'
        history.useTransaction(trx)
        await history.save()

        payment.useTransaction(trx)
        await payment.delete()
    })

    session.flash('success', 'Paiement supprimé avec succès.')
    return response.redirect().back()
  }
}
