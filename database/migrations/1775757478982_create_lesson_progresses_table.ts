import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_progresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_id').unsigned().references('students.id').onDelete('CASCADE').index().notNullable()
      table.integer('lesson_id').unsigned().references('lessons.id').onDelete('CASCADE').index().notNullable()
      table.boolean('is_completed').defaultTo(false).notNullable()
      table.timestamp('completed_at').nullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}