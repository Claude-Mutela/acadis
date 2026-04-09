import { LessonSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Module from './module.js'

export default class Lesson extends LessonSchema {
    @belongsTo(() => Module)
    declare module: BelongsTo<typeof Module>
}