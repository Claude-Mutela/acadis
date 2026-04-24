import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Manuel from '#models/manuel'
import { createManuelValidator, updateManuelValidator } from '#validators/manuel'
import string from '@adonisjs/core/helpers/string'

export default class ManuelsController {
  async store({ request, response, session }: HttpContext) {
    // 1. Valider les champs textuels
    const payload = await request.validateUsing(createManuelValidator)

    // 2. Gérer le fichier PDF (obligatoire)
    const pdfFile = request.file('file', {
      size: '20mb',
      extnames: ['pdf'],
    })

    if ((!pdfFile || !pdfFile.isValid) && !payload.fileUrl) {
      session.flash('errors', { file: pdfFile?.errors?.[0]?.message || 'Le fichier PDF ou un lien externe est obligatoire.' })
      return response.redirect().back()
    }

    // 3. Gérer la couverture (optionnelle)
    const coverFile = request.file('coverImage', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    try {
      let pdfPath: string | null = null
      if (pdfFile && pdfFile.isValid) {
        const pdfName = `${string.random(20)}.pdf`
        await pdfFile.move(app.publicPath('uploads/manuels'), { name: pdfName })
        pdfPath = `/uploads/manuels/${pdfName}`
      }

      let coverImagePath: string | null = null
      if (coverFile && coverFile.isValid) {
        const coverName = `${string.random(20)}.${coverFile.extname}`
        await coverFile.move(app.publicPath('uploads/manuels/covers'), { name: coverName })
        coverImagePath = `/uploads/manuels/covers/${coverName}`
      }

      // 5. Créer l'enregistrement en base
      await Manuel.create({
        programId: payload.programId,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        isPublished: payload.isPublished ?? false,
        fileUrl: payload.fileUrl ?? null,
        file: pdfPath || '',
        coverImage: coverImagePath,
      })

      session.flash('success', 'Manuel ajouté avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de l'ajout du manuel : " + error.message)
      return response.redirect().back()
    }
  }

  async update({ params, request, response, session }: HttpContext) {
    const manuel = await Manuel.findOrFail(params.id)
    const payload = await request.validateUsing(updateManuelValidator)

    // Gérer nouveau fichier PDF (optionnel lors de la mise à jour)
    const pdfFile = request.file('file', {
      size: '20mb',
      extnames: ['pdf'],
    })

    // Gérer nouvelle couverture (optionnelle)
    const coverFile = request.file('coverImage', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    try {
      // Mettre à jour les champs texte
      manuel.title = payload.title
      manuel.description = payload.description
      manuel.price = payload.price
      manuel.isPublished = payload.isPublished ?? manuel.isPublished
      manuel.fileUrl = payload.fileUrl ?? manuel.fileUrl

      // Remplacer le PDF si un nouveau est fourni
      if (pdfFile && pdfFile.isValid) {
        const pdfName = `${string.random(20)}.pdf`
        await pdfFile.move(app.publicPath('uploads/manuels'), { name: pdfName })
        manuel.file = `/uploads/manuels/${pdfName}`
      }

      // Remplacer la couverture si une nouvelle est fournie
      if (coverFile && coverFile.isValid) {
        const coverName = `${string.random(20)}.${coverFile.extname}`
        await coverFile.move(app.publicPath('uploads/manuels/covers'), { name: coverName })
        manuel.coverImage = `/uploads/manuels/covers/${coverName}`
      }

      await manuel.save()
      session.flash('success', 'Manuel mis à jour avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de la mise à jour : " + error.message)
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const manuel = await Manuel.findOrFail(params.id)
      await manuel.delete()

      session.flash('success', 'Manuel supprimé avec succès !')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Erreur lors de la suppression : " + error.message)
      return response.redirect().back()
    }
  }
}
