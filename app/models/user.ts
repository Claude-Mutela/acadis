import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import { hasOne, hasMany, column } from '@adonisjs/lucid/orm'
import UserProfile from '#models/user_profile'
import StudentProfile from '#models/student_profile'
import Enrollment from '#models/enrollment'
import Payment from '#models/payment'
import LessonProgress from '#models/lesson_progress'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  
  declare role: 'superadmin' | 'admin' | 'financial' | 'student' | 'trainer' | 'supervisor'
  declare status: 'active' | 'inactive' | 'suspended' | 'pending'

  @hasOne(() => UserProfile)
  declare profile: HasOne<typeof UserProfile>

  @hasOne(() => StudentProfile)
  declare studentProfile: HasOne<typeof StudentProfile>

  @hasMany(() => Enrollment)
  declare enrollments: HasMany<typeof Enrollment>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasMany(() => LessonProgress)
  declare lessonProgresses: HasMany<typeof LessonProgress>

  get initials() {
    const defaultInitials = this.email.substring(0, 2).toUpperCase()
    return defaultInitials
  }

  get isAdmin() {
    return ['superadmin', 'admin', 'financial', 'supervisor'].includes(this.role)
  }

  get isStudent() {
    return this.role === 'student'
  }

  get isTrainer() {
    return this.role === 'trainer'
  }
}
