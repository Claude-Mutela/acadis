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

router
  .group(() => {
    // Dashboard
    router.on('/administration/dashboard').renderInertia('administration/dashboard', {}).as('admin.dashboard')
    
    // Utilisateurs
    router.get('/administration/utilisateurs', [controllers.Users, 'index']).as('admin.users.index')
    router.on('/administration/presences').renderInertia('administration/presences', {}).as('admin.presences.index')
    router.post('/administration/utilisateurs', [controllers.Users, 'store']).as('admin.users.store')
    router.put('/administration/utilisateurs/:id', [controllers.Users, 'update']).as('admin.users.update')
    router.delete('/administration/utilisateurs/:id', [controllers.Users, 'destroy']).as('admin.users.destroy')
    
    // Ministeres
    router.get('/administration/ministeres', [controllers.Ministries, 'index']).as('admin.ministeres.index')
    router.post('/administration/ministeres', [controllers.Ministries, 'store']).as('admin.ministeres.store')
    router.put('/administration/ministeres/:id', [controllers.Ministries, 'update']).as('admin.ministeres.update')
    router.delete('/administration/ministeres/:id', [controllers.Ministries, 'destroy']).as('admin.ministeres.destroy')
    
    // Formateurs
    router.get('/administration/formateurs', [controllers.Trainers, 'index']).as('admin.formateurs.index')
    router.post('/administration/formateurs', [controllers.Trainers, 'store']).as('admin.formateurs.store')
    router.put('/administration/formateurs/:id', [controllers.Trainers, 'update']).as('admin.formateurs.update')
    router.delete('/administration/formateurs/:id', [controllers.Trainers, 'destroy']).as('admin.formateurs.destroy')
    
    // Programmes, Modules, Manuels
    router.get('/administration/programmes', [controllers.Programmes, 'index']).as('admin.programmes.index')
    router.post('/administration/programmes', [controllers.Programmes, 'store']).as('admin.programmes.store')
    router.put('/administration/programmes/:id', [controllers.Programmes, 'update']).as('admin.programmes.update')
    router.delete('/administration/programmes/:id', [controllers.Programmes, 'destroy']).as('admin.programmes.destroy')
    
    router.post('/administration/programmes/modules', [controllers.Modules, 'store']).as('admin.programmes.modules.store')
    router.put('/administration/programmes/modules/:id', [controllers.Modules, 'update']).as('admin.programmes.modules.update')
    router.delete('/administration/programmes/modules/:id', [controllers.Modules, 'destroy']).as('admin.programmes.modules.destroy')
    
    router.post('/administration/programmes/manuels', [controllers.Manuels, 'store']).as('admin.programmes.manuels.store')
    router.put('/administration/programmes/manuels/:id', [controllers.Manuels, 'update']).as('admin.programmes.manuels.update')
    router.delete('/administration/programmes/manuels/:id', [controllers.Manuels, 'destroy']).as('admin.programmes.manuels.destroy')
    
    // Planning
    router.get('/administration/planning', [controllers.Plannings, 'index']).as('admin.planning.index')
    router.post('/administration/planning', [controllers.Plannings, 'store']).as('admin.planning.store')
    router.put('/administration/planning/:id', [controllers.Plannings, 'update']).as('admin.planning.update')
    router.delete('/administration/planning/:id', [controllers.Plannings, 'destroy']).as('admin.planning.destroy')
    
    // Profil Admin
    router.on('/administration/profil').renderInertia('administration/profil', {}).as('admin.profil')
    
    // Cohortes
    router.get('/administration/cohortes', [controllers.Cohorts, 'index']).as('admin.cohortes.index')
    router.post('/administration/cohortes', [controllers.Cohorts, 'store']).as('admin.cohortes.store')
    router.put('/administration/cohortes/:id', [controllers.Cohorts, 'update']).as('admin.cohortes.update')
    router.delete('/administration/cohortes/:id', [controllers.Cohorts, 'destroy']).as('admin.cohortes.destroy')

    // Étudiants (Admin view)
    router.get('/administration/etudiants', [controllers.Students, 'index']).as('admin.etudiants.index')
    router.post('/administration/etudiants', [controllers.Students, 'store']).as('admin.etudiants.store')
    router.put('/administration/etudiants/:id', [controllers.Students, 'update']).as('admin.etudiants.update')
    router.delete('/administration/etudiants/:id', [controllers.Students, 'destroy']).as('admin.etudiants.destroy')

    // ── Espace Apprenant (Étudiant) ──
    router.on('/etudiant/dashboard').renderInertia('etudiant/dashboard', {}).as('student.dashboard')
    router.on('/etudiant/catalogue').renderInertia('etudiant/catalogue', {}).as('student.catalogue')
    router.on('/etudiant/profil').renderInertia('etudiant/profil', {}).as('student.profil')

    // Logout
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']).as('signup.create')
    router.post('signup', [controllers.NewAccount, 'store']).as('signup.store')

    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())
