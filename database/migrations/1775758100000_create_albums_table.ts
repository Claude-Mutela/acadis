import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'albums'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('album_category_id').unsigned().references('id').inTable('album_categories').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('slug').unique().notNullable()
      table.text('description').nullable()
      table.string('cover_img').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
