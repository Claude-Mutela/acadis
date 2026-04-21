import { CohortSchema } from '#database/schema'
import { manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Program from './program.js'
import Vacation from './vacation.js'

export default class Cohort extends CohortSchema {
    @manyToMany(() => Program, {
        pivotTable: 'cohort_programs',
    })
    declare programs: ManyToMany<typeof Program>

    @hasMany(() => Vacation)
    declare vacations: HasMany<typeof Vacation>
}