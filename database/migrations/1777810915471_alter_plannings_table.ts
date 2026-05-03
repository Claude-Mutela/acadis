import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plannings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('program_id').unsigned().references('id').inTable('programs').onDelete('CASCADE').after('id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('program_id')
    })
  }
}