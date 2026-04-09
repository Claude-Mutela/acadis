import { LessonProgressSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Student from './student.js'
import Lesson from './lesson.js'

export default class LessonProgress extends LessonProgressSchema {
    @belongsTo(() => Student)
    declare student: BelongsTo<typeof Student>

    @belongsTo(() => Lesson)
    declare lesson: BelongsTo<typeof Lesson>
}