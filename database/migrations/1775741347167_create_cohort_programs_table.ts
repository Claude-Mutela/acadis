import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cohort_programs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cohort_id').unsigned().references('cohorts.id').onDelete('CASCADE').index().notNullable()
      table.integer('program_id').unsigned().references('programs.id').onDelete('CASCADE').index().notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}