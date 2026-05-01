import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import User from '#models/user'
import Manuel from '#models/manuel'
import ManualPurchase from '#models/manual_purchase'
import PaymentHistory from '#models/payment_history'
import Invoice from '#models/invoice'
import Program from '#models/program'
import Vacation from '#models/vacation'
import Cohort from '#models/cohort'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class PaymentsController {
  async index({ inertia }: HttpContext) {
    const payments = await Payment.query()
      .preload('user', (q) => {
        q.preload('enrollments', (eq) => {
          eq.preload('program').preload('vacation').preload('planning', (pq) => {
            pq.preload('cohorts')
          })
        })
      })
      .preload('invoice')
      .orderBy('createdAt', 'desc')

    const manualPurchases = await ManualPurchase.query().preload('manuel')
    
    const serializedPayments = payments.map((p) => {
      const mp = manualPurchases.find((m) => m.paymentId === p.id)
      const enrollment = p.user?.enrollments?.find(e => e.programId === p.programId) || p.user?.enrollments?.[0]
      
      // Fallback hierarchy for programId: Payment -> Manual -> Enrollment
      const programId = p.programId || mp?.manuel?.programId || enrollment?.programId || 0

      return {
        id: p.id,
        etudiant: p.user?.fullName || 'Inconnu',
        manuel: mp?.manuel?.title || 'N/A',
        manuelPrice: Number(mp?.manuel?.price || 0),
        montant: Number(p.amount),
        methode: p.paymentType === 'cash' ? 'Cash' : p.paymentType === 'mobile_money' ? 'Mobile Money' : 'Card',
        statut: p.status === 'completed' ? 'Solde' : 'Acompte',
        date: p.createdAt?.toFormat('dd LLL yyyy') || '',
        isoDate: p.createdAt?.toISODate() || '',
        time: p.createdAt?.toFormat('HH:mm') || '',
        userId: p.userId,
        manuelId: mp?.manuelId || 0,
        programId: Number(programId),
        vacationId: Number(enrollment?.vacationId || 0),
        cohortId: Number(enrollment?.planning?.cohorts?.[0]?.id || 0)
      }
    })

    const students = await User.query().where('role', 'student').orderBy('firstName', 'asc')
    const manuals = await Manuel.query().orderBy('title', 'asc')
    const vacations = await Vacation.query().orderBy('day', 'asc')
    const cohorts = await Cohort.query().orderBy('name', 'asc')

    return inertia.render('administration/paiements/index', {
      initialPayments: serializedPayments,
      studentsList: students.map(s => ({ id: s.id, nom: s.lastName, prenom: s.firstName })),
      manuelsList: manuals.map(m => ({ id: m.id, title: m.title, price: m.price })),
      vacationsList: vacations.map(v => ({ id: v.id, title: `${v.day} (${v.startTime}-${v.endTime})` })),
      cohortsList: cohorts.map(c => ({ id: c.id, title: c.name }))
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
      history.amount = montant.toString()
      history.paymentType = 'cash'
      history.status = payment.status
      history.recordedById = admin.id
      history.recordedByName = admin.fullName
      history.actionType = 'CREATE'
      history.useTransaction(trx)
      await history.save()

      // Create Invoice
      const invoice = new Invoice()
      invoice.paymentId = payment.id
      invoice.totalAmount = montant
      invoice.issueDate = DateTime.now()
      invoice.useTransaction(trx)
      await invoice.save()
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
        history.amount = montant.toString()
        history.paymentType = payment.paymentType
        history.status = payment.status
        history.recordedById = admin.id
        history.recordedByName = admin.fullName
        history.actionType = 'UPDATE'
        history.useTransaction(trx)
        await history.save()

        // Sync Invoice
        const invoice = await Invoice.query().where('paymentId', payment.id).useTransaction(trx).first()
        if (invoice) {
            invoice.totalAmount = montant
            await invoice.save()
        }
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
        history.amount = payment.amount.toString()
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
