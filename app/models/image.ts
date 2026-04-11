import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Album from './album.js'

export default class Image extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare albumId: number

  @column()
  declare title: string | null

  @column()
  declare location: string | null

  @column.date()
  declare date: DateTime | null

  @column()
  declare filePath: string

  @belongsTo(() => Album)
  declare album: BelongsTo<typeof Album>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
