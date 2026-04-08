import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import type { HasOne } from '@adonisjs/lucid/types/relations'
import { hasOne, column } from '@adonisjs/lucid/orm'
import UserProfile from './user_profile.js'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  
  @column()
  declare role: 'superadmin' | 'admin' | 'student' | 'trainer'

  @column()
  declare status: 'active' | 'inactive' | 'suspended'

  @hasOne(() => UserProfile)
  declare profile: HasOne<typeof UserProfile>

  get initials() {
    const defaultInitials = this.email.substring(0, 2).toUpperCase()
    return defaultInitials
  }
}
