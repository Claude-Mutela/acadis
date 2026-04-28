import { PaymentHistorySchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Payment from './payment.js'

export default class PaymentHistory extends PaymentHistorySchema {
    @belongsTo(() => Payment)
    declare payment: BelongsTo<typeof Payment>

    @belongsTo(() => User, {
        foreignKey: 'recordedById'
    })
    declare recordedBy: BelongsTo<typeof User>
}
