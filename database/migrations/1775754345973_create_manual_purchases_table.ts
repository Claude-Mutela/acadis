import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'manual_purchases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_id').unsigned().references('students.id').onDelete('CASCADE').index().notNullable()
      table.integer('manuel_id').unsigned().references('manuels.id').onDelete('CASCADE').index().notNullable()
      table.integer('payment_id').unsigned().references('payments.id').onDelete('CASCADE').index().notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}