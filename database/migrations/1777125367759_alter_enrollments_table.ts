import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('program_id').unsigned().references('id').inTable('programs').onDelete('CASCADE').after('planning_id')
      table.integer('vacation_id').unsigned().references('id').inTable('vacations').onDelete('SET NULL').after('program_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('program_id')
      table.dropColumn('vacation_id')
    })
  }
}