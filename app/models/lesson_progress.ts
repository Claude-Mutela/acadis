import { LessonProgressSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Lesson from './lesson.js'

export default class LessonProgress extends LessonProgressSchema {
    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Lesson)
    declare lesson: BelongsTo<typeof Lesson>
}