import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payment_histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('payment_id').unsigned().nullable().index() // Nullable in case of deletion?
      table.string('student_name').notNullable()
      table.string('manuel_title').notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.string('payment_type').notNullable()
      table.string('status').notNullable()
      table.integer('recorded_by_id').unsigned().references('users.id').onDelete('SET NULL').nullable()
      table.string('recorded_by_name').notNullable()
      table.string('action_type').notNullable() // 'CREATE', 'UPDATE', 'DELETE'
      table.text('details').nullable() // JSON or string details
      
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}