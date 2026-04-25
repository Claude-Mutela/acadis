import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Cohort from '#models/cohort'
import Program from '#models/program'
import Department from '#models/department'

export default class StudentsController {
  async index({ inertia }: HttpContext) {
    const students = await User.query()
      .where('role', 'student')
      .preload('studentProfile')
      .preload('enrollments', (query) => {
        query.preload('planning', (pQuery) => {
          pQuery.preload('cohorts')
        })
        query.preload('program')
        query.preload('vacation')
        query.orderBy('created_at', 'desc')
      })
      .orderBy('last_name', 'asc')

    const cohorts = await Cohort.query()
      .preload('programs', (q) => q.preload('vacations'))
      .orderBy('name', 'asc')
    
    const allPrograms = await Program.query()
      .preload('vacations')
      .orderBy('name', 'asc')
      
    const departments = await Department.query().orderBy('name', 'asc')

    return inertia.render('administration/etudiants/index', {
      students,
      filters: {
        cohorts,
        allPrograms,
        departments
      }
    } as any)
  }
}
