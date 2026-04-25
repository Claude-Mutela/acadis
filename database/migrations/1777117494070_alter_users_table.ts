import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', ['superadmin', 'admin', 'financial', 'student', 'trainer', 'supervisor'])
        .notNullable().defaultTo('student').alter()
      table.enum('status', ['active', 'inactive', 'suspended', 'pending'])
        .notNullable().defaultTo('pending').alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', ['superadmin', 'admin', 'student', 'trainer'])
        .notNullable().defaultTo('student').alter()
      table.enum('status', ['active', 'inactive', 'suspended'])
        .notNullable().defaultTo('active').alter()
    })
  }
}