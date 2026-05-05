import { ProgramSchema } from '#database/schema'
import { belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import ProgramCategory from './program_category.js'
import Cohort from './cohort.js'
import Module from './module.js'
import Manuel from './manuel.js'
import Trainer from './trainer.js'
import Vacation from './vacation.js'
import Enrollment from './enrollment.js'

export default class Program extends ProgramSchema {
    @column()
    declare categoryId: number | null

    @belongsTo(() => ProgramCategory, {
      foreignKey: 'categoryId',
    })
    declare category: BelongsTo<typeof ProgramCategory>

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

    @manyToMany(() => Vacation, {
      pivotTable: 'program_vacation',
    })
    declare vacations: ManyToMany<typeof Vacation>

    @manyToMany(() => Enrollment, {
        pivotTable: 'enrollment_programs',
        pivotColumns: ['vacation_id'],
    })
    declare enrollments: ManyToMany<typeof Enrollment>
}