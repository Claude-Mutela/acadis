import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_profiles'

  async up() {
    this.schema.dropTableIfExists(this.tableName)
    
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').index().notNullable().unique()
      
      table.string('gender').notNullable()
      table.string('home_church').notNullable()
      table.string('worker').notNullable() // Type string as requested
      table.string('ministry').nullable()
      table.string('format').notNullable() // online, onsite, etc.
      table.string('student_profile_image').nullable()
      table.text('physique_address').nullable()
      table.string('phone_number').nullable()
      table.date('dateofbirth').nullable()

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}