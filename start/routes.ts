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
router.on('/administration/formateurs').renderInertia('administration/formateurs/index', {}).as('admin.formateurs.index')
// Etudiants
router.on('/administration/etudiants').renderInertia('administration/etudiants/index', {}).as('admin.etudiants.index')
// Paiements
router.on('/administration/paiements').renderInertia('administration/paiements/index', {}).as('admin.paiements.index')
// Programmes
router.on('/administration/programmes').renderInertia('administration/programmes/index', {}).as('admin.programmes.index')
// Planning
router.on('/administration/planning').renderInertia('administration/planning/index', {}).as('admin.planning.index')
// Profil
router.on('/administration/profil').renderInertia('administration/profil', {}).as('admin.profil')
// Cohortes
router.on('/administration/cohortes').renderInertia('administration/cohortes/index', {}).as('admin.cohortes.index')

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
