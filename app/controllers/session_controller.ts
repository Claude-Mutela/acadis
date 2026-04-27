import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.all()

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      // Redirection basée sur le rôle
      if (user.role === 'student') {
        return response.redirect().toRoute('student.dashboard')
      }
      if (user.role === 'supervisor') {
        return response.redirect().toRoute('admin.presences.index')
      }

      return response.redirect().toRoute('admin.dashboard')
    } 
    catch 
    {
      session.flash('errorsBag', {
        E_INVALID_CREDENTIALS: 'Identifiants incorrects. Vérifiez votre email et mot de passe.',
      })
      return response.redirect().back()
    }
  }

  async destroy({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.clear() // Efface absolument tout de la session
    return response.redirect().toRoute('session.create')
  }
}
