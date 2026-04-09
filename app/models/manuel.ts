import { ManuelSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Program from './program.js'

export default class Manuel extends ManuelSchema {
    @belongsTo(() => Program)
    declare program: BelongsTo<typeof Program>
}