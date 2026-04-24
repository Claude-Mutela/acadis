import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plannings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.enum('type', ['présentiel', 'en ligne', 'hybride']).notNullable()
      table.enum('status', ['Inscriptions', 'En cours', 'Terminé', 'Annulé']).defaultTo('Inscriptions').notNullable()
      table.integer('capacity').notNullable().defaultTo(0)
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}