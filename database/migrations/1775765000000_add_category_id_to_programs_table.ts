import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'programs'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('category_id').unsigned().references('program_categories.id').onDelete('SET NULL').index().after('id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['category_id'])
      table.dropColumn('category_id')
    })
  }
}
