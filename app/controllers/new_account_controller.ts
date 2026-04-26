import User from '#models/user'
import StudentProfile from '#models/student_profile'
import db from '@adonisjs/lucid/services/db'
import { publicSignupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(publicSignupValidator)
    
    // Création dans une transaction pour inclure le profil étudiant par défaut
    const user = await db.transaction(async (trx) => {
      const newUser = await User.create({ 
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        role: 'student',
        status: 'pending'
      }, { client: trx })

      // Création automatique du profil étudiant avec 'online' par défaut
      await StudentProfile.create({
        userId: newUser.id,
        gender: 'M', // Valeur par défaut, l'étudiant pourra la modifier
        homeChurch: 'À compléter',
        worker: 'Non',
        format: 'online', // Inscription publique = en ligne par défaut
      }, { client: trx })

      return newUser
    })

    await auth.use('web').login(user)
    response.redirect().toRoute('student.dashboard')
  }
}
