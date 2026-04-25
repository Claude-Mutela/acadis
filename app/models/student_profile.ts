import { DateTime } from 'luxon'
import { StudentProfileSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class StudentProfile extends StudentProfileSchema {
  @column()
  declare userId: number

  @column()
  declare gender: string

  @column()
  declare homeChurch: string

  @column()
  declare worker: string

  @column()
  declare ministry: string | null

  @column()
  declare format: string

  @column()
  declare studentProfileImage: string | null

  @column()
  declare physiqueAddress: string | null

  @column()
  declare phoneNumber: string | null

  @column.date()
  declare dateofbirth: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}