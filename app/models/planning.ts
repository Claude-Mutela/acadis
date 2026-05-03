import { PlanningSchema } from '#database/schema'
import { column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Cohort from './cohort.js'
import Enrollment from './enrollment.js'
import Program from './program.js'

export default class Planning extends PlanningSchema {
    @column()
    declare programId: number

    @belongsTo(() => Program)
    declare program: BelongsTo<typeof Program>

    @manyToMany(() => Cohort, {
        pivotTable: 'cohort_plannings',
    })
    declare cohorts: ManyToMany<typeof Cohort>

    @hasMany(() => Enrollment)
    declare enrollments: HasMany<typeof Enrollment>
}