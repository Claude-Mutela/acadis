import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_id').unsigned().references('students.id').onDelete('CASCADE').index().notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('phone').nullable()
      table.string('avatar').nullable()
      table.string('gender').notNullable()
      table.string('home_church').notNullable()
      table.boolean('worker').notNullable()
      table.string('ministry').notNullable()
      table.enum('format', ['online', 'onsite']).notNullable()

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}