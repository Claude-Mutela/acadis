import { InvoiceSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Payment from './payment.js'

export default class Invoice extends InvoiceSchema {
    @belongsTo(() => Payment)
    declare payment: BelongsTo<typeof Payment>
}