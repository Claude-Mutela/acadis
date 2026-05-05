import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollment_programs'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('vacation_id').unsigned().references('id').inTable('vacations').onDelete('SET NULL').nullable()
    })

    // Migrer les vacations existantes depuis enrollments vers enrollment_programs
    this.defer(async (db) => {
      const enrollments = await db.from('enrollments').whereNotNull('vacation_id').select('id', 'vacation_id')
      for (const e of enrollments) {
        await db.from(this.tableName).where('enrollment_id', e.id).update({ vacation_id: e.vacation_id })
      }
    })

    this.schema.alterTable('enrollments', (table) => {
      table.dropForeign(['vacation_id'])
      table.dropColumn('vacation_id')
    })
  }

  async down() {
    this.schema.alterTable('enrollments', (table) => {
      table.integer('vacation_id').unsigned().references('id').inTable('vacations').onDelete('SET NULL').nullable()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['vacation_id'])
      table.dropColumn('vacation_id')
    })
  }
}