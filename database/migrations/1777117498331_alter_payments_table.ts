import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('student_id')
      table.dropColumn('student_id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').index().notNullable().after('id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('user_id')
      table.dropColumn('user_id')
      table.integer('student_id').unsigned().references('id').inTable('students').onDelete('CASCADE').index().notNullable().after('id')
    })
  }
}