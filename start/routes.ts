/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')
router.on('/about').renderInertia('about', {}).as('about')
router.on('/programme').renderInertia('programme', {}).as('programme')
router.on('/galerie').renderInertia('galerie/index', {}).as('galerie')
router.get('/galerie/:slug', async ({ params, inertia }) => {
  return inertia.render('galerie/album', { slug: params.slug })
}).as('galerie.show')
router.get('/programme/:id', async ({ params, inertia }) => {
  return inertia.render('programme_detail', { id: params.id })
}).as('programme.show')
router.on('/calendrier').renderInertia('calendrier', {}).as('calendrier')
router.on('/contact').renderInertia('contact', {}).as('contact')

// Administration
// Utilisateurs
router.on('/administration/dashboard').renderInertia('administration/dashboard', {}).as('admin.dashboard')
router.get('/administration/utilisateurs', [controllers.Users, 'index']).as('admin.users.index')
router.post('/administration/utilisateurs', [controllers.Users, 'store']).as('admin.users.store')
router.put('/administration/utilisateurs/:id', [controllers.Users, 'update']).as('admin.users.update')
router.delete('/administration/utilisateurs/:id', [controllers.Users, 'destroy']).as('admin.users.destroy')
// Ministeres
router.get('/administration/ministeres', [controllers.Ministries, 'index']).as('admin.ministeres.index')
router.post('/administration/ministeres', [controllers.Ministries, 'store']).as('admin.ministeres.store')
router.put('/administration/ministeres/:id', [controllers.Ministries, 'update']).as('admin.ministeres.update')
router.delete('/administration/ministeres/:id', [controllers.Ministries, 'destroy']).as('admin.ministeres.destroy')
// Formateurs
// Formateurs
router.get('/administration/formateurs', [controllers.Trainers, 'index']).as('admin.formateurs.index')
router.post('/administration/formateurs', [controllers.Trainers, 'store']).as('admin.formateurs.store')
router.put('/administration/formateurs/:id', [controllers.Trainers, 'update']).as('admin.formateurs.update')
router.delete('/administration/formateurs/:id', [controllers.Trainers, 'destroy']).as('admin.formateurs.destroy')
// Etudiants
router.on('/administration/etudiants').renderInertia('administration/etudiants/index', {}).as('admin.etudiants.index')
// Paiements
router.on('/administration/paiements').renderInertia('administration/paiements/index', {}).as('admin.paiements.index')
// Programmes & Catégories
router.get('/administration/programmes', [controllers.Programmes, 'index']).as('admin.programmes.index')
router.post('/administration/programmes', [controllers.Programmes, 'store']).as('admin.programmes.store')
router.put('/administration/programmes/:id', [controllers.Programmes, 'update']).as('admin.programmes.update')
router.delete('/administration/programmes/:id', [controllers.Programmes, 'destroy']).as('admin.programmes.destroy')

router.post('/administration/programmes/categories', [controllers.ProgramCategories, 'store']).as('admin.programmes.categories.store')
router.put('/administration/programmes/categories/:id', [controllers.ProgramCategories, 'update']).as('admin.programmes.categories.update')
router.delete('/administration/programmes/categories/:id', [controllers.ProgramCategories, 'destroy']).as('admin.programmes.categories.destroy')

// Vacations
router.post('/administration/programmes/vacations', [controllers.Vacations, 'store']).as('admin.programmes.vacations.store')
router.put('/administration/programmes/vacations/:id', [controllers.Vacations, 'update']).as('admin.programmes.vacations.update')
router.delete('/administration/programmes/vacations/:id', [controllers.Vacations, 'destroy']).as('admin.programmes.vacations.destroy')

// Modules
router.post('/administration/programmes/modules', [controllers.Modules, 'store']).as('admin.programmes.modules.store')
router.put('/administration/programmes/modules/:id', [controllers.Modules, 'update']).as('admin.programmes.modules.update')
router.delete('/administration/programmes/modules/:id', [controllers.Modules, 'destroy']).as('admin.programmes.modules.destroy')

// Planning
router.on('/administration/planning').renderInertia('administration/planning/index', {}).as('admin.planning.index')
// Profil
router.on('/administration/profil').renderInertia('administration/profil', {}).as('admin.profil')
// Cohortes
router.get('/administration/cohortes', [controllers.Cohorts, 'index']).as('admin.cohortes.index')
router.post('/administration/cohortes', [controllers.Cohorts, 'store']).as('admin.cohortes.store')
router.put('/administration/cohortes/:id', [controllers.Cohorts, 'update']).as('admin.cohortes.update')
router.delete('/administration/cohortes/:id', [controllers.Cohorts, 'destroy']).as('admin.cohortes.destroy')

// Espace Apprenant (Étudiant)
router.on('/etudiant/dashboard').renderInertia('etudiant/dashboard', {}).as('student.dashboard')
router.on('/etudiant/catalogue').renderInertia('etudiant/catalogue', {}).as('student.catalogue')
router.on('/etudiant/profil').renderInertia('etudiant/profil', {}).as('student.profil')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
