import { TrainerSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Program from './program.js'

export default class Trainer extends TrainerSchema {
    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @hasMany(() => Program)
    declare programs: HasMany<typeof Program>
}