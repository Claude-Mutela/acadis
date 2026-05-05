import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import StudentProfile from '#models/student_profile'
import Enrollment from '#models/enrollment'
import Cohort from '#models/cohort'
import Program from '#models/program'
import Department from '#models/department'
import Vacation from '#models/vacation'
import { storeStudentValidator, updateStudentValidator } from '#validators/student'

export default class StudentsController {
  // ── INDEX ───────────────────────────────────────────────────────────────────
  async index({ inertia }: HttpContext) {
    const students = await User.query()
      .where('role', 'student')
      .preload('studentProfile')
      .preload('enrollments', (query) => {
        query.preload('planning', (pQuery) => {
          pQuery.preload('cohorts')
        })
        query.preload('programs')
      })
      .orderBy('last_name', 'asc')

    // Requête directe sur enrollment_programs pour contourner le bug de
    // sérialisation de pivotColumns() dans les preloads imbriqués
    const enrollmentPrograms = await db
      .from('enrollment_programs')
      .select('enrollment_id', 'program_id', 'vacation_id')

    const cohorts = await Cohort.query()
      .preload('programs', (q) => q.preload('vacations'))
      .preload('plannings')
      .orderBy('name', 'asc')

    const allPrograms = await Program.query()
      .preload('vacations')
      .orderBy('name', 'asc')

    const departments = await Department.query().orderBy('name', 'asc')
    const allVacations = await Vacation.query().orderBy('name', 'asc')

    return inertia.render('administration/etudiants/index', {
      students,
      enrollmentPrograms,
      filters: { cohorts, allPrograms, departments, allVacations }
    } as any)
  }

  // ── STORE ───────────────────────────────────────────────────────────────────
  async store({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(storeStudentValidator)

    await db.transaction(async (trx) => {
      // 1. Créer le compte utilisateur
      const user = await User.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: await hash.make(payload.password),
        role: 'student',
        status: 'active',
      }, { client: trx })

      // 2. Créer le profil disciple
      await StudentProfile.create({
        userId: user.id,
        gender: payload.gender,
        homeChurch: payload.homeChurch,
        worker: payload.worker ? 'Oui' : 'Non',
        ministry: payload.ministry ?? null,
        format: 'présentiel', // Valeur par défaut, modifiable plus tard
        physiqueAddress: payload.physiqueAddress ?? null,
        phoneNumber: payload.phoneNumber ?? null,
        dateofbirth: payload.dateofbirth ? payload.dateofbirth : null,
      }, { client: trx })

      // 3. Créer l'inscription
      const enrollment = await Enrollment.create({
        userId: user.id,
        planningId: payload.planningId,
        status: payload.status as 'pending' | 'confirmed' | 'rejected' | 'cancelled',
        enrolledBy: auth.user?.id ?? null,
      }, { client: trx })

      // 4. Attacher les programmes avec leurs vacations
      const programsData = {}
      payload.programs.forEach(p => {
        programsData[p.id] = { vacation_id: p.vacationId }
      })
      await enrollment.related('programs').attach(programsData)
    })

    session.flash('success', 'Étudiant inscrit avec succès.')
    return response.redirect().back()
  }

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  async update({ request, response, params, session }: HttpContext) {
    const payload = await request.validateUsing(updateStudentValidator)

    const user = await User.findOrFail(params.id)

    await db.transaction(async (trx) => {
      // 1. Mettre à jour les infos du compte
      user.useTransaction(trx)
      if (payload.firstName) user.firstName = payload.firstName
      if (payload.lastName) user.lastName = payload.lastName
      if (payload.email) user.email = payload.email
      await user.save()

      // 2. Mettre à jour le profil disciple
      const profile = await StudentProfile.findBy('user_id', user.id, { client: trx })
      if (profile) {
        if (payload.gender !== undefined) profile.gender = payload.gender
        if (payload.homeChurch !== undefined) profile.homeChurch = payload.homeChurch
        if (payload.worker !== undefined) profile.worker = payload.worker ? 'Oui' : 'Non'
        if (payload.ministry !== undefined) profile.ministry = payload.ministry ?? null
        if (payload.physiqueAddress !== undefined) profile.physiqueAddress = payload.physiqueAddress ?? null
        if (payload.phoneNumber !== undefined) profile.phoneNumber = payload.phoneNumber ?? null
        if (payload.dateofbirth !== undefined) profile.dateofbirth = payload.dateofbirth ? payload.dateofbirth : null
        profile.useTransaction(trx)
        await profile.save()
      }

      // 3. Mettre à jour la dernière inscription
      const enrollment = await Enrollment.query({ client: trx })
        .where('user_id', user.id)
        .orderBy('created_at', 'desc')
        .first()

      if (enrollment) {
        if (payload.planningId !== undefined) enrollment.planningId = payload.planningId
        if (payload.status !== undefined) enrollment.status = payload.status as 'pending' | 'confirmed' | 'rejected' | 'cancelled'
        enrollment.useTransaction(trx)
        await enrollment.save()

        // Synchroniser les programmes si fournis
        if (payload.programs !== undefined) {
          const syncData = {}
          payload.programs.forEach(p => {
            syncData[p.id] = { vacation_id: p.vacationId }
          })
          await enrollment.related('programs').sync(syncData)
        }
      }
    })

    session.flash('success', 'Profil étudiant mis à jour avec succès.')
    return response.redirect().back()
  }

  // ── DESTROY ─────────────────────────────────────────────────────────────────
  async destroy({ params, response, session }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      session.flash('error', "Cet étudiant n'existe plus ou a déjà été supprimé.")
      return response.redirect().back()
    }

    // Les enrollments et student_profile seront supprimés par CASCADE
    await user.delete()

    session.flash('success', 'Étudiant supprimé avec succès.')
    return response.redirect().back()
  }
}
