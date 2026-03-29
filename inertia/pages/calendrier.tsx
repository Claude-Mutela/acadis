import { Link } from '@inertiajs/react'
import Layout from '../components/Layout'
import { CalendarDays, Clock, MapPin, ChevronRight, GraduationCap, Users, BookOpen, Flame, CalendarCheck } from 'lucide-react'

// ── Mock Data ─────────────────────────────────────────────────────────────────

const sessionEnCours = {
  programme: 'Parcours Fondamental',
  cohorte: 'Session Prémice',
  dateDebut: '09 Mars 2026',
  dateFin: '31 Mai 2026',
  progression: 20, // Pourcentage
  status: 'En cours',
  participants: 280,
}

const sessionsAVenir = [
  {
    id: 1,
    titre: 'École des Ouvriers',
    cohorte: 'Edition 2',
    dateDebut: '05 Septembre 2026',
    duree: '6 mois',
    placesRestantes: 45,
    tag: 'Inscriptions ouvertes',
    couleurTonalite: 'orange'
  },
  {
    id: 2,
    titre: 'Leadership Biblique Avancé',
    cohorte: 'Cohorte Fin d\'année 2026',
    dateDebut: '10 Octobre 2026',
    duree: '2 mois',
    placesRestantes: 20,
    tag: 'Places limitées',
    couleurTonalite: 'red'
  },
  {
    id: 3,
    titre: 'Evangelisation et Mission',
    cohorte: 'Cohorte Automne 2026',
    dateDebut: '15 Septembre 2026',
    duree: '3 mois',
    placesRestantes: 80,
    tag: 'Nouveau',
    couleurTonalite: 'green'
  }
]

const hebdomadaire = [
  {
    jour: 'Mardi',
    heure: '17H30 - 19H30',
    titre: 'Culte d\'Enseignement (Malakisi)',
    description: 'Approfondissement de la doctrine chrétienne et étude systématique des Saintes Écritures.',
    lieu: 'Temple de l\'Eglise',
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    jour: 'Jeudi',
    heure: '17H30 - 19H30',
    titre: 'Culte d\'Intercession (Etoko)',
    description: 'Temps de prière fervente, de jeûne corporatif et de combat spirituel sacerdotal.',
    lieu: 'Temple de l\'Eglise',
    icon: <Flame className="w-6 h-6" />
  },
  {
    jour: 'Dimanche',
    heure: '08H00 - 10H00',
    titre: 'Culte de Célébration',
    description: 'Rassemblement de toute l\'assemblée pour la louange, l\'adoration et la prédication dominicale.',
    lieu: 'Temple de l\'Eglise',
    icon: <Users className="w-6 h-6" />
  }
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function Calendrier() {
  return (
    <Layout title="Calendrier Académique — ACADIS">
      
      {/* ════════════════════════════════════════════════════════
          1. HEADER HERO
      ════════════════════════════════════════════════════════ */}
      <section className="bg-black text-white pt-24 pb-20 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-orange/20 text-orange font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full mb-6">
            <CalendarDays className="w-4 h-4" />
            Agenda Officiel
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Calendrier <span className="text-orange">Académique</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Consultez les dates clés, suivez la session en cours, et préparez-vous pour les prochaines cohortes de formation de l'Académie des Disciples.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. SESSION EN COURS
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 relative -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-2xl font-black text-black">Session en cours</h2>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col lg:flex-row gap-10 items-center">
            
            {/* Info Principale */}
            <div className="flex-1 space-y-4 w-full">
              <span className="text-sm font-bold text-orange uppercase tracking-wider">{sessionEnCours.cohorte}</span>
              <h3 className="text-3xl font-black text-black">{sessionEnCours.programme}</h3>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                  <CalendarDays className="w-4 h-4 text-orange" />
                  Du {sessionEnCours.dateDebut} au {sessionEnCours.dateFin}
                </div>
                <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                  <Users className="w-4 h-4 text-orange" />
                  {sessionEnCours.participants} disciples inscrits
                </div>
              </div>
            </div>

            {/* Barre de Progression */}
            <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-gray-700">Progression</span>
                <span className="text-sm font-black text-orange">{sessionEnCours.progression}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange rounded-full transition-all duration-1000" 
                  style={{ width: `${sessionEnCours.progression}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Examen de mi-parcours imminent
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. SESSIONS À VENIR (PROCHAINES RENTRÉES)
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-black mb-4 flex items-center gap-3">
                <CalendarCheck className="w-8 h-8 text-orange" />
                Prochaines Rentrées
              </h2>
              <p className="text-gray-500 max-w-2xl text-lg">
                Ne manquez pas l'opportunité de rejoindre nos futurs programmes. Les places sont limitées pour garantir un suivi personnalisé.
              </p>
            </div>
            <Link 
              href="/programme"
              className="text-orange font-bold hover:text-orange-600 flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              Voir tous les programmes
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessionsAVenir.map((session) => (
              <div key={session.id} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-orange hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-orange/10 text-orange rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    session.couleurTonalite === 'green' ? 'bg-green-100 text-green-700' :
                    session.couleurTonalite === 'red' ? 'bg-red-100 text-red-700' :
                    'bg-orange/20 text-orange'
                  }`}>
                    {session.tag}
                  </span>
                </div>

                <div className="mb-6 flex-grow">
                  <div className="text-sm font-bold text-gray-400 mb-1">{session.cohorte}</div>
                  <h3 className="text-xl font-bold text-black mb-4 group-hover:text-orange transition-colors">
                    {session.titre}
                  </h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      Début : <span className="text-black">{session.dateDebut}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Durée : <span className="text-black">{session.duree}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <Users className="w-4 h-4 text-gray-400" />
                      Places restantes : <span className="text-orange font-bold">{session.placesRestantes}</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="w-full text-center bg-gray-50 hover:bg-orange text-black hover:text-white font-bold py-3 px-4 rounded-xl transition-colors border border-gray-200 hover:border-orange block"
                >
                  Candidater
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4. PROGRAMME D'ACTIVITÉS (HEBDOMADAIRE)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-black text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Programme des Cultes
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Le rythme spirituel hebdomadaire de l'église et de l'académie. Ces rassemblements sont ouverts à tous et obligatoires pour les disciples en formation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {hebdomadaire.map((jour, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-orange/50 transition-colors group">
                <div className="w-14 h-14 bg-white/5 group-hover:bg-orange/20 text-white group-hover:text-orange rounded-2xl flex items-center justify-center mb-6 transition-colors">
                  {jour.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{jour.jour}</h3>
                <div className="inline-block bg-orange text-white text-sm font-bold px-3 py-1 rounded-md mb-4 shadow-sm">
                  {jour.heure}
                </div>
                <h4 className="text-lg font-bold text-gray-200 mb-3">{jour.titre}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {jour.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium pt-5 border-t border-gray-800">
                  <MapPin className="w-4 h-4 text-orange" />
                  {jour.lieu}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. CTA BOTTOM
      ════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-orange text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-6">Vous avez une question sur l'agenda ?</h2>
          <Link
            href="/contact"
            className="inline-flex bg-black hover:bg-gray-900 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl hover:-translate-y-1 text-lg"
          >
            Contactez le secrétariat
          </Link>
        </div>
      </section>

    </Layout>
  )
}
