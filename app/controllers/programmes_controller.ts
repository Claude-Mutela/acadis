import type { HttpContext } from '@adonisjs/core/http'
import Program from '#models/program'
import ProgramCategory from '#models/program_category'
import Trainer from '#models/trainer'
import Cohort from '#models/cohort'
import { createProgramValidator, updateProgramValidator } from '#validators/program'
import app from '@adonisjs/core/services/app'
import string from '@adonisjs/core/helpers/string'
import fs from 'node:fs'

export default class ProgrammesController {
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
    const { default: Vacation } = await import('#models/vacation')
    const vacations = await Vacation.query().preload('programs').orderBy('day', 'asc')
    
    return inertia.render('administration/programmes/index', { 
      programs, 
      categories,
      trainers,
      cohorts,
      vacations
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

    const { coverImage, objectives, outputProfile, cohortId, ...data } = payload

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

      // Attacher la cohorte (relation many-to-many)
      if (cohortId) {
        await program.related('cohorts').sync([cohortId])
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

    const { coverImage: _unused, objectives, outputProfile, cohortId, ...data } = payload

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

      // Synchroniser la cohorte (relation many-to-many)
      if (cohortId !== undefined) {
        await program.related('cohorts').sync(cohortId ? [cohortId] : [])
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
