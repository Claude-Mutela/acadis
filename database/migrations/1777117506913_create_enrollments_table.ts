import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').index().notNullable()
      table.integer('planning_id').unsigned().references('id').inTable('plannings').onDelete('CASCADE').index().notNullable()
      table.integer('enrolled_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
      table.enum('status', ['pending', 'confirmed', 'rejected', 'cancelled']).defaultTo('pending').notNullable()
      table.text('notes').nullable()
      table.timestamp('enrolled_at').defaultTo(this.now())
      table.unique(['user_id', 'planning_id'])
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}