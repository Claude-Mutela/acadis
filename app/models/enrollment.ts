import { EnrollmentSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Planning from '#models/planning'

export default class Enrollment extends EnrollmentSchema {
  @column()
  declare status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare student: BelongsTo<typeof User>

  @belongsTo(() => Planning, { foreignKey: 'planningId' })
  declare planning: BelongsTo<typeof Planning>

  @belongsTo(() => User, { foreignKey: 'enrolledBy' })
  declare enrolledByUser: BelongsTo<typeof User>
}
