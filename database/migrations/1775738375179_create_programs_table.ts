import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'programs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('trainer_id').unsigned().references('trainers.id').onDelete('CASCADE').index().notNullable()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.string('slug').notNullable().unique()
      table.text('presentation').notNullable()
      table.string('duration').notNullable()
      table.enum('status', ['active', 'pending']).defaultTo('pending').notNullable()
      table.text('objectives').notNullable()
      table.text('output_profile').notNullable()
      table.string('cover_image').nullable()
      
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}