import { ScheduleSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cohort from './cohort.js'
import Program from './program.js'

export default class Schedule extends ScheduleSchema {
    @belongsTo(() => Cohort)
    declare cohort: BelongsTo<typeof Cohort>

    @belongsTo(() => Program)
    declare program: BelongsTo<typeof Program>
}