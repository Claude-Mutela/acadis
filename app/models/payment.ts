import { PaymentSchema } from '#database/schema'
import { belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Student from './student.js'
import Program from './program.js'
import Invoice from './invoice.js'

export default class Payment extends PaymentSchema {
    @belongsTo(() => Student)
    declare student: BelongsTo<typeof Student>

    @belongsTo(() => Program)
    declare program: BelongsTo<typeof Program>

    @hasOne(() => Invoice)
    declare invoice: HasOne<typeof Invoice>
}