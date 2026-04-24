import { PlanningSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Cohort from './cohort.js'

export default class Planning extends PlanningSchema {
    @manyToMany(() => Cohort, {
        pivotTable: 'cohort_plannings',
    })
    declare cohorts: ManyToMany<typeof Cohort>
}