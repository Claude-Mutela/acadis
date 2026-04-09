import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trainers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').index().notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('gender').notNullable()
      table.string('title').notNullable()
      table.string('home_church').notNullable()
      table.string('specialization').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}