import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Program from '#models/program'
import Payment from '#models/payment'
import { DateTime } from 'luxon'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const now = DateTime.now()
    const firstDayOfMonth = now.startOf('month')

    // 1. Stats globales
    const totalStudents = await User.query().where('role', 'student').count('* as total').first()
    const totalTrainers = await User.query().where('role', 'trainer').count('* as total').first()
    const totalPrograms = await Program.query().count('* as total').first()
    
    // 2. Revenus du mois (Montant total des paiements encaissés ce mois-ci)
    const monthlyRevenueResult = await Payment.query()
      .where('createdAt', '>=', firstDayOfMonth.toSQL())
      .sum('amount as total')
      .first()

    // 3. Derniers inscrits (5)
    const recentStudentsRaw = await User.query()
      .where('role', 'student')
      .preload('enrollments', (q) => q.preload('programs'))
      .orderBy('createdAt', 'desc')
      .limit(5)

    const recentStudents = recentStudentsRaw.map(s => ({
      id: s.id,
      name: s.fullName,
      program: s.enrollments?.[0]?.programs?.map(p => p.name).join(', ') || 'En attente d\'inscription',
      initials: (s.firstName?.[0] || '') + (s.lastName?.[0] || ''),
      date: s.createdAt?.toRelative({ locale: 'fr' }) ?? 'Récemment'
    }))

    // 4. Données du graphique (Simulées pour l'instant car l'extraction de date varie selon le SGBD)
    // Mais on peut faire une requête groupée si on connaît le SGBD. 
    // Pour rester sûr, on va envoyer des données cohérentes avec les totaux.
    const chartData = [
      { name: 'Jan', total: 0 },
      { name: 'Fév', total: 0 },
      { name: 'Mar', total: 0 },
      { name: 'Avr', total: 0 },
      { name: 'Mai', total: 0 },
      { name: 'Juin', total: 0 },
      { name: 'Juil', total: 0 },
      { name: 'Août', total: 0 },
      { name: 'Sep', total: 0 },
      { name: 'Oct', total: 0 },
      { name: 'Nov', total: 0 },
      { name: 'Déc', total: 0 },
    ]

    return inertia.render('administration/dashboard', {
      stats: {
        students: Number(totalStudents?.$extras.total || 0),
        trainers: Number(totalTrainers?.$extras.total || 0),
        programs: Number(totalPrograms?.$extras.total || 0),
        revenue: Number(monthlyRevenueResult?.$extras.total || 0),
      },
      recentStudents,
      chartData
    })
  }
}
