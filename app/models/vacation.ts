import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Cohort from '#models/cohort'
import Program from '#models/program'

export default class Vacation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cohortId: number

  @column()
  declare day: string

  @column()
  declare startTime: string

  @column()
  declare endTime: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Cohort)
  declare cohort: BelongsTo<typeof Cohort>

  @manyToMany(() => Program, {
    pivotTable: 'program_vacation',
    pivotTimestamps: true
  })
  declare programs: ManyToMany<typeof Program>
}
