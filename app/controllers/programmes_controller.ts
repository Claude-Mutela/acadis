import type { HttpContext } from '@adonisjs/core/http'
import Program from '#models/program'
import ProgramCategory from '#models/program_category'
import Trainer from '#models/trainer'
import Cohort from '#models/cohort'
import Vacation from '#models/vacation'
import Planning from '#models/planning'
import { DateTime } from 'luxon'
import { createProgramValidator, updateProgramValidator } from '#validators/program'
import app from '@adonisjs/core/services/app'
import string from '@adonisjs/core/helpers/string'
import fs from 'node:fs'

export default class ProgrammesController {
  async home({ inertia }: HttpContext) {
    const hasActivePrograms = await Program.query().where('status', 'active').first()
    const vacations = await Vacation.query().preload('programs').orderBy('day', 'asc').orderBy('startTime', 'asc')

    // Session en cours
    const currentPlanning = await Planning.query()
      .where('status', 'En cours')
      .preload('cohorts', (q) => q.preload('programs'))
      .withCount('enrollments')
      .first()

    let currentSession = null
    if (currentPlanning) {
      const start = DateTime.fromJSDate(new Date(currentPlanning.startDate))
      const end = DateTime.fromJSDate(new Date(currentPlanning.endDate))
      const now = DateTime.now()
      const total = end.diff(start).as('milliseconds')
      const elapsed = now.diff(start).as('milliseconds')
      const progression = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))

      currentSession = {
        ...currentPlanning.serialize(),
        progression,
        enrollmentCount: parseInt(currentPlanning.$extras.enrollments_count || '0'),
        cohort: currentPlanning.cohorts[0] || null,
        program: currentPlanning.cohorts[0]?.programs[0] || null,
      }
    }

    // Prochaines rentrées
    const upcomingPlannings = await Planning.query()
      .where('status', 'Inscriptions')
      .preload('cohorts', (q) => q.preload('programs'))
      .withCount('enrollments')
      .orderBy('startDate', 'asc')
      .limit(3)

    const upcomingSessions = upcomingPlannings.map((p) => {
      const start = DateTime.fromJSDate(new Date(p.startDate))
      const end = DateTime.fromJSDate(new Date(p.endDate))
      const durationInMonths = Math.round(end.diff(start, 'months').months)
      const remainingSpots = Math.max(0, p.capacity - parseInt(p.$extras.enrollments_count || '0'))

      return {
        ...p.serialize(),
        remainingSpots,
        durationInMonths,
        cohort: p.cohorts[0] || null,
        program: p.cohorts[0]?.programs[0] || null,
      }
    })

    return (inertia as any).render('home', {
      hasActivePrograms: !!hasActivePrograms,
      vacations: vacations.map(v => v.serialize()),
    })
  }

  async calendar({ inertia }: HttpContext) {
    // Session en cours
    const currentPlanning = await Planning.query()
      .where('status', 'En cours')
      .preload('cohorts', (q) => q.preload('programs'))
      .withCount('enrollments')
      .first()

    let currentSession = null
    if (currentPlanning) {
      const start = DateTime.fromJSDate(new Date(currentPlanning.startDate))
      const end = DateTime.fromJSDate(new Date(currentPlanning.endDate))
      const now = DateTime.now()
      const total = end.diff(start).as('milliseconds')
      const elapsed = now.diff(start).as('milliseconds')
      const progression = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))

      currentSession = {
        ...currentPlanning.serialize(),
        progression,
        enrollmentCount: parseInt(currentPlanning.$extras.enrollments_count || '0'),
        cohort: currentPlanning.cohorts[0] || null,
        program: currentPlanning.cohorts[0]?.programs[0] || null,
      }
    }

    // Prochaines rentrées
    const upcomingPlannings = await Planning.query()
      .where('status', 'Inscriptions')
      .preload('cohorts', (q) => q.preload('programs'))
      .withCount('enrollments')
      .orderBy('startDate', 'asc')
      .limit(3)

    const upcomingSessions = upcomingPlannings.map((p) => {
      const start = DateTime.fromJSDate(new Date(p.startDate))
      const end = DateTime.fromJSDate(new Date(p.endDate))
      const durationInMonths = Math.round(end.diff(start, 'months').months)
      const remainingSpots = Math.max(0, p.capacity - parseInt(p.$extras.enrollments_count || '0'))

      return {
        ...p.serialize(),
        remainingSpots,
        durationInMonths,
        cohort: p.cohorts[0] || null,
        program: p.cohorts[0]?.programs[0] || null,
      }
    })

    return (inertia as any).render('calendrier', {
      currentSession,
      upcomingSessions,
    })
  }

  async index({ inertia }: HttpContext) {
    const programs = await Program.query()
      .preload('category')
      .preload('cohorts')
      .preload('trainer', (q) => q.preload('user'))
      .preload('modules')
      .preload('manuels')
      .orderBy('createdAt', 'desc')

    const categories = await ProgramCategory.query().orderBy('name', 'asc')
    const trainers = await Trainer.query().preload('user')
    const cohorts = await Cohort.query().orderBy('name', 'asc')
    // Récupérer les vacations avec pré-chargement de leurs programmes
    const vacations = await Vacation.query().preload('programs').orderBy('day', 'asc')

    return inertia.render('administration/programmes/index', {
      programs,
      categories,
      trainers,
      cohorts,
      vacations
    })
  }

  async publicIndex({ inertia }: HttpContext) {
    const programs = await Program.query()
      .where('status', 'active')
      .preload('category')
      .orderBy('name', 'asc')

    const categories = await ProgramCategory.query().orderBy('name', 'asc')

    return (inertia as any).render('programme', {
      programs: programs.map((p) => p.serialize()),
      categories: categories.map((c) => c.serialize()),
    })
  }

  async publicShow({ params, inertia }: HttpContext) {
    const program = await Program.query()
      .where('slug', params.slug)
      .where('status', 'active')
      .preload('category')
      .preload('modules', (q) => q.orderBy('order', 'asc'))
      .preload('manuels')
      .firstOrFail()

    return (inertia as any).render('programme_detail', {
      program: program.serialize(),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createProgramValidator)

    // Slug generation (unique)
    let slug = string.slug(payload.name).toLowerCase()
    const existing = await Program.findBy('slug', slug)
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    // Handle Image
    let coverImagePath: string | null = null
    const image = request.file('coverImage')

    if (image) {
      const fileName = `${Date.now()}-${image.clientName}`
      await image.move(app.makePath('public/uploads/programs'), {
        name: fileName
      })
      coverImagePath = `/uploads/programs/${fileName}`
    }

    const { coverImage, objectives, outputProfile, cohortIds, ...data } = payload

    try {
      const program = await Program.create({
        ...data,
        description: data.description ?? '',
        presentation: data.presentation ?? '',
        duration: data.duration ?? '',
        slug,
        coverImage: coverImagePath || undefined,
        objectives: JSON.stringify(objectives || []),
        outputProfile: JSON.stringify(outputProfile || [])
      })

      // Attacher les cohortes (relation many-to-many)
      if (cohortIds && cohortIds.length > 0) {
        await program.related('cohorts').sync(cohortIds)
      }
      session.flash('success', 'Programme créé avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de l'enregistrement en base de données : " + error.message)
      return response.redirect().back()
    }
  }

  async update({ params, request, response, session }: HttpContext) {
    const program = await Program.findOrFail(params.id)
    const payload = await request.validateUsing(updateProgramValidator)

    // Handle Image
    const image = request.file('coverImage')
    if (image) {
      // Delete old image if exists
      if (program.coverImage) {
        const oldPath = app.makePath('public', program.coverImage.substring(1))
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      const fileName = `${Date.now()}-${image.clientName}`
      await image.move(app.makePath('public/uploads/programs'), {
        name: fileName
      })
      program.coverImage = `/uploads/programs/${fileName}`
    }

    const { coverImage: _unused, objectives, outputProfile, cohortIds, ...data } = payload

    // Update fields
    if (data.name) {
      program.name = data.name
      program.slug = string.slug(data.name).toLowerCase()
    }
    program.categoryId = data.categoryId ?? program.categoryId
    program.trainerId = data.trainerId ?? program.trainerId
    program.description = data.description ?? program.description ?? ''
    program.presentation = data.presentation ?? program.presentation ?? ''
    program.duration = data.duration ?? program.duration ?? ''
    program.status = data.status ?? program.status

    if (objectives) {
      program.objectives = JSON.stringify(objectives)
    }
    if (outputProfile) {
      program.outputProfile = JSON.stringify(outputProfile)
    }

    try {
      await program.save()

      // Synchroniser les cohortes (relation many-to-many)
      if (cohortIds !== undefined) {
        await program.related('cohorts').sync(cohortIds)
      }

      session.flash('success', 'Programme mis à jour avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de la mise à jour : " + error.message)
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    const program = await Program.findOrFail(params.id)

    // Delete image file
    if (program.coverImage) {
      const filePath = app.makePath('public', program.coverImage.substring(1))
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await program.delete()

    session.flash('success', 'Programme supprimé avec succès !')
    return response.redirect().back()
  }
}
