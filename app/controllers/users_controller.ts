import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'

export default class UsersController {
  /**
   * GET /administration/utilisateurs
   */
  async index({ inertia }: HttpContext) {
    const users = await User.all()
    return inertia.render('administration/users/index', { users })
  }

  /**
   * POST /administration/utilisateurs
   */
  async store({ request, inertia }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)

    // Le mot de passe est automatiquement hashé par withAuthFinder (via le hook beforeSave)
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      status: data.status,
    })

    return inertia.render('administration/users/index', { user })
  }

  /**
   * PUT /administration/utilisateurs/:id
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['firstName', 'lastName', 'email', 'role', 'status'])
    user.merge(data)
    await user.save()
    return response.redirect().toRoute('admin.users.index')
  }

  /**
   * DELETE /administration/utilisateurs/:id
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.redirect().toRoute('admin.users.index')
  }
}