import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'program_vacation'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vacation_id').unsigned().references('vacations.id').onDelete('CASCADE').index().notNullable()
      table.integer('program_id').unsigned().references('programs.id').onDelete('CASCADE').index().notNullable()
      table.unique(['vacation_id', 'program_id'])
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
