import { ManualPurchaseSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Manuel from './manuel.js'
import Payment from './payment.js'

export default class ManualPurchase extends ManualPurchaseSchema {
    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Manuel, {
        foreignKey: 'manuelId'
    })
    declare manuel: BelongsTo<typeof Manuel>

    @belongsTo(() => Payment)
    declare payment: BelongsTo<typeof Payment>
}
