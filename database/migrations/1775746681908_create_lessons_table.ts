import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('module_id').unsigned().references('modules.id').onDelete('CASCADE').index().notNullable()
      table.string('title').notNullable()
      table.text('content').notNullable()
      table.integer('order').notNullable()
      table.enum('type', ['video', 'text', 'quiz']).notNullable()
      table.string('video_url').nullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}