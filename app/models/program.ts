import { ProgramSchema } from '#database/schema'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Cohort from './cohort.js'
import Module from './module.js'
import Manuel from './manuel.js'
import Trainer from './trainer.js'

export default class Program extends ProgramSchema {
    @belongsTo(() => Trainer)
    declare trainer: BelongsTo<typeof Trainer>

    @manyToMany(() => Cohort, {
        pivotTable: 'cohort_programs',
    })
    declare cohorts: ManyToMany<typeof Cohort>

    @hasMany(() => Module)
    declare modules: HasMany<typeof Module>

    @hasMany(() => Manuel)
    declare manuels: HasMany<typeof Manuel>
}