import { CohortSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Program from './program.js'

export default class Cohort extends CohortSchema {
    @manyToMany(() => Program, {
        pivotTable: 'cohort_programs',
    })
    declare programs: ManyToMany<typeof Program>
}