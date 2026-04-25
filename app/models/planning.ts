import { PlanningSchema } from '#database/schema'
import { manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Cohort from './cohort.js'
import Enrollment from './enrollment.js'

export default class Planning extends PlanningSchema {
    @manyToMany(() => Cohort, {
        pivotTable: 'cohort_plannings',
    })
    declare cohorts: ManyToMany<typeof Cohort>

    @hasMany(() => Enrollment)
    declare enrollments: HasMany<typeof Enrollment>
}