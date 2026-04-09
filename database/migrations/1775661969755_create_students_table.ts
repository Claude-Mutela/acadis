import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('email').notNullable()
      table.string('password').notNullable()
      table.enum('role', ['student']).defaultTo('student').notNullable()
      table.enum('status', ['active', 'pending', 'rejected']).defaultTo('pending').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}