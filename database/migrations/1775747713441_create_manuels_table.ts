import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'manuels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('program_id').unsigned().references('programs.id').onDelete('CASCADE').index().notNullable()
      table.string('title').notNullable()
      table.string('file').notNullable()                          // Chemin local du fichier PDF (obligatoire)
      table.string('file_url').nullable().defaultTo(null)         // URL externe optionnelle
      table.string('description').notNullable()
      table.integer('price').notNullable()
      table.boolean('is_published').defaultTo(false).notNullable()
      table.string('cover_image').nullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}