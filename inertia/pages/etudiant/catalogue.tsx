import { useState } from 'react'
import { Head } from '@inertiajs/react'
import StudentLayout from '../../components/etudiant/StudentLayout'
import { Search, Compass, Clock, CheckCircle, ChevronRight, BookmarkPlus } from 'lucide-react'

const catalogMock = [
  {
    id: 1,
    title: 'École des Ouvriers',
    category: 'Leadership & Ministère',
    description: 'Une formation complète pour ceux qui aspirent à servir activement dans l\'église au travers de divers comités et départements.',
    duration: '3 mois',
    nextCohort: 'Hiver 2026',
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop',
    enrolled: false
  },
  {
    id: 2,
    title: 'Leadership Biblique',
    category: 'Leadership & Ministère',
    description: 'Principes de direction, gestion d\'équipe et influence spirituelle selon les modèles bibliques.',
    duration: '8 semaines',
    nextCohort: 'Printemps 2026',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
    enrolled: false
  },
  {
    id: 3,
    title: 'Parcours Fondamental',
    category: 'Théologie',
    description: 'Les bases incontournables de la foi chrétienne pour affrmir votre marche avec Dieu.',
    duration: '6 mois',
    nextCohort: 'Promotion 4',
    thumbnail: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=600&auto=format&fit=crop',
    enrolled: true // Simulation d'un cours déjà suivi
  }
]

export default function StudentCatalogue() {
  const [search, setSearch] = useState('')
  const [catalog, setCatalog] = useState(catalogMock)
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<typeof catalogMock[0] | null>(null)

  const filteredCatalog = catalog.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleEnrollClick = (program: typeof catalogMock[0]) => {
    setSelectedProgram(program)
    setIsEnrollModalOpen(true)
  }

  const confirmEnrollment = () => {
    if (selectedProgram) {
      setCatalog(catalog.map(p => p.id === selectedProgram.id ? { ...p, enrolled: true } : p))
      setIsEnrollModalOpen(false)
    }
  }

  return (
    <StudentLayout title="Catalogue Pédagogique">
      <Head title="Catalogue — Espace Étudiant" />

      {/* Hero Section */}
      <div className="bg-gray-900 rounded-3xl p-8 text-white mb-8 flex flex-col items-center text-center relative overflow-hidden h-64 justify-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange to-transparent"></div>
        <div className="relative z-10 max-w-2xl">
          <Compass className="w-12 h-12 text-orange mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-2">Explorez nos Programmes</h1>
          <p className="text-gray-400">Découvrez de nouveaux cursus et inscrivez-vous aux prochaines cohortes disponibles de l'Académie.</p>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Rechercher par titre, catégorie (ex: Théologie)..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border-2 border-transparent focus:border-orange shadow-lg shadow-black/5 rounded-2xl py-4 pl-12 pr-6 text-gray-900 font-medium outline-none transition-colors"
          />
        </div>
      </div>

      {/* Liste du catalogue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCatalog.length > 0 ? filteredCatalog.map((program) => (
          <div key={program.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl group">
            <div className="h-40 relative overflow-hidden">
               <img src={program.thumbnail} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-4 left-4">
                 <span className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                   {program.category}
                 </span>
               </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{program.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">{program.description}</p>
              
              <div className="mt-auto grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-orange mb-1" />
                  <p className="text-xs text-gray-500 font-bold uppercase">Durée</p>
                  <p className="text-sm font-bold text-gray-900">{program.duration}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <Compass className="w-4 h-4 text-blue-500 mb-1" />
                  <p className="text-xs text-gray-500 font-bold uppercase">Rentrée</p>
                  <p className="text-sm font-bold text-gray-900">{program.nextCohort}</p>
                </div>
              </div>

              {program.enrolled ? (
                <button disabled className="w-full bg-green-50 text-green-700 font-bold py-3 rounded-xl border border-green-200 flex items-center justify-center gap-2 cursor-not-allowed">
                  <CheckCircle className="w-5 h-5" /> Déjà inscrit
                </button>
              ) : (
                <button 
                  onClick={() => handleEnrollClick(program)}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-transform hover:-translate-y-0.5 shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                >
                  <BookmarkPlus className="w-5 h-5" /> S'inscrire
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-gray-500">Aucun programme ne correspond à votre recherche.</div>
        )}
      </div>

      {/* Modale d'inscription */}
      {isEnrollModalOpen && selectedProgram && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEnrollModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-orange/10 text-orange rounded-full flex items-center justify-center mx-auto mb-5">
              <Compass className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Inscription</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Vous êtes sur le point de postuler pour la cohorte <strong>{selectedProgram.nextCohort}</strong> du programme <strong>{selectedProgram.title}</strong>.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl mb-8 text-left border border-gray-100">
               <ul className="text-sm text-gray-600 space-y-2 font-medium">
                 <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Engagement de <strong>{selectedProgram.duration}</strong></li>
                 <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Accès aux supports de cours</li>
                 <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Suivi personnalisé</li>
               </ul>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEnrollModalOpen(false)} 
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={confirmEnrollment} 
                className="flex-[2] py-3.5 bg-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                Confirmer l'inscription <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </StudentLayout>
  )
}
