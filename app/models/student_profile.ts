import { StudentProfileSchema } from '#database/schema'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { belongsTo } from '@adonisjs/lucid/orm'
import Student from './student.js'

export default class StudentProfile extends StudentProfileSchema {
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>
}