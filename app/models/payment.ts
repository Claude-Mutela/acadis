import { PaymentSchema } from '#database/schema'
import { belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Program from './program.js'
import Invoice from './invoice.js'

export default class Payment extends PaymentSchema {
    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Program)
    declare program: BelongsTo<typeof Program>

    @hasOne(() => Invoice)
    declare invoice: HasOne<typeof Invoice>
}