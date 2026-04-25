import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Drop student_profiles and students after all FK migrations
    this.schema.dropTableIfExists('student_profiles')
    this.schema.dropTableIfExists('students')
  }

  async down() {
    // Recreate students table
    this.schema.createTable('students', (table) => {
      table.increments('id')
      table.text('email').notNullable()
      table.string('password').notNullable()
      table.enum('role', ['student']).defaultTo('student').notNullable()
      table.enum('status', ['active', 'pending', 'rejected']).defaultTo('pending').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })

    // Recreate student_profiles linked to students
    this.schema.createTable('student_profiles', (table) => {
      table.increments('id')
      table.integer('student_id').unsigned().references('id').inTable('students').onDelete('CASCADE').index().notNullable()
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
}