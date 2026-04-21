import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vacations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cohort_id').unsigned().references('cohorts.id').onDelete('CASCADE').index().notNullable()
      table.string('day').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
