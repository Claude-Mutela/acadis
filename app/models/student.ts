import { StudentSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { hasMany, hasOne, column } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import StudentProfile from './student_profile.js'
import Payment from './payment.js'
import LessonProgress from './lesson_progress.js'

export default class Student extends compose(StudentSchema, withAuthFinder(hash)) {
    @column()
    declare role: 'student'

    @column()
    declare status: 'active' | 'pending' | 'rejected'

    @hasOne(() => StudentProfile)
    declare profile: HasOne<typeof StudentProfile>

    @hasMany(() => Payment)
    declare payments: HasMany<typeof Payment>

    @hasMany(() => LessonProgress)
    declare lessonProgresses: HasMany<typeof LessonProgress>

    get initials() {
        const defaultInitials = this.email.substring(0, 2).toUpperCase()
        return defaultInitials
    }
}