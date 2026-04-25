import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'testimonies'

  async up() {
    // student_id is dropped since students table will be removed
    // user_id already exists in the table
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('student_id')
      table.dropColumn('student_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('student_id').unsigned().references('id').inTable('students').onDelete('SET NULL').nullable()
    })
  }
}