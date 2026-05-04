import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollment_programs'

  async up() {
    await this.schema.dropTableIfExists(this.tableName)
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('enrollment_id').unsigned().references('id').inTable('enrollments').onDelete('CASCADE').notNullable()
      table.integer('program_id').unsigned().references('id').inTable('programs').onDelete('CASCADE').notNullable()
      table.unique(['enrollment_id', 'program_id'])
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })

    // Migrer les données existantes de enrollments.program_id vers enrollment_programs
    this.defer(async (db) => {
      const enrollments = await db.from('enrollments').whereNotNull('program_id').select('id', 'program_id')
      
      const toInsert = enrollments.map(e => ({
        enrollment_id: e.id,
        program_id: e.program_id,
        created_at: new Date(),
        updated_at: new Date()
      }))

      if (toInsert.length > 0) {
        await db.table(this.tableName).insert(toInsert)
      }
    })

    this.schema.alterTable('enrollments', (table) => {
      // Supprimer la contrainte de clé étrangère avant de supprimer la colonne
      table.dropForeign('program_id')
      table.dropColumn('program_id')
    })
  }

  async down() {
    this.schema.alterTable('enrollments', (table) => {
      table.integer('program_id').unsigned().references('id').inTable('programs').onDelete('CASCADE').nullable()
    })
    this.schema.dropTable(this.tableName)
  }
}