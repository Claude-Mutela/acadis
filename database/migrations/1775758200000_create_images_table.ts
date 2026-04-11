import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('album_id').unsigned().references('id').inTable('albums').onDelete('CASCADE')
      table.string('title').nullable()
      table.string('location').nullable()
      table.date('date').nullable()
      table.string('file_path').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
