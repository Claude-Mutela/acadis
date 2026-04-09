import { ModuleSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Program from './program.js'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Lesson from './lesson.js'

export default class Module extends ModuleSchema {
    @belongsTo(() => Program)
    declare program: BelongsTo<typeof Program>

    @hasMany(() => Lesson)
    declare lessons: HasMany<typeof Lesson>
}