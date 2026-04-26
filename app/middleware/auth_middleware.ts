import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    
    // Empêche le navigateur de mettre en cache les pages protégées
    ctx.response.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    ctx.response.header('Pragma', 'no-cache')
    ctx.response.header('Expires', '0')

    return next()
  }
}
