import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_id').unsigned().references('students.id').onDelete('CASCADE').index().notNullable()
      table.integer('program_id').unsigned().references('programs.id').onDelete('CASCADE').index().notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table.enum('payment_type', ['cash', 'mobile_money', 'card']).notNullable()
      table.string('reference').notNullable()//numero de reçu ou transaction
      table.timestamp('paid_at').defaultTo(this.now())
      table.enum('status', ['pending', 'completed', 'failed']).notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}