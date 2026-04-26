import { Head, usePage } from '@inertiajs/react'
import StudentLayout from '../../components/etudiant/StudentLayout'
import { PlayCircle, Clock, BookOpen, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

// Mock Data pour l'étudiant
const enrolledPrograms = [
  {
    id: 1,
    title: 'Parcours Fondamental',
    cohorte: 'Promotion 4',
    progress: 45,
    status: 'En cours',
    thumbnail: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=600&auto=format&fit=crop',
    nextModule: 'L\'Église : Son but et sa mission'
  },
  {
    id: 2,
    title: 'Face à moi-même',
    cohorte: 'Session Automne',
    progress: 100,
    status: 'Terminé',
    thumbnail: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600&auto=format&fit=crop',
    nextModule: null
  }
]

export default function StudentDashboard() {
  const { props } = usePage<any>()
  const [programs, setPrograms] = useState(enrolledPrograms)
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null)

  const confirmUnenroll = () => {
    if (selectedProgramId) {
      setPrograms(programs.filter(p => p.id !== selectedProgramId))
      setIsUnenrollModalOpen(false)
    }
  }
  
  return (
    <StudentLayout title="Mon Apprentissage">
      <Head title="Mes Cours — Espace Étudiant" />

      {/* Message de bienvenue */}
      <div className="bg-gradient-to-r from-orange to-orange-600 rounded-3xl p-8 text-white shadow-lg shadow-orange/20 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2">Bonjour {props.user?.firstName} ! 👋</h1>
          <p className="text-white/80 font-medium text-lg">Prêt à continuer votre progression spirituelle aujourd'hui ?</p>
        </div>
        <div className="hidden md:flex items-center justify-center w-24 h-24 bg-white/10 rounded-full backdrop-blur-md">
           <BookOpen className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Programmes Actifs</h2>
        <p className="text-gray-500 text-sm">Reprenez là où vous vous êtes arrêté.</p>
      </div>

      {/* Liste des cours inscrits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {programs.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <BookOpen className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">Aucun programme en cours</h3>
             <p className="text-gray-500 mb-6">Vous n'êtes actuellement inscrit à aucun programme de formation.</p>
             <a href="/etudiant/catalogue" className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Explorer le catalogue
             </a>
          </div>
        ) : (
          programs.map((program) => (
            <div key={program.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl group flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img src={program.thumbnail} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                   {program.status === 'Terminé' ? (
                     <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-2">
                       <CheckCircle className="w-3.5 h-3.5" /> Programme Terminé
                     </span>
                   ) : (
                     <span className="inline-flex items-center gap-1.5 bg-orange text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-2">
                       <PlayCircle className="w-3.5 h-3.5" /> En cours
                     </span>
                   )}
                   <h3 className="text-2xl font-black text-white leading-tight">{program.title}</h3>
                   <p className="text-white/80 text-sm font-medium">{program.cohorte}</p>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6 flex-1">
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-sm font-bold text-gray-700">Progression</span>
                     <span className="text-sm font-black text-orange">{program.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${program.progress === 100 ? 'bg-green-500' : 'bg-orange'}`}
                      style={{ width: `${program.progress}%` }}
                    ></div>
                  </div>
                  
                  {program.nextModule && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-3">
                       <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                       <div>
                         <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Module Actuel</p>
                         <p className="text-sm font-bold text-gray-900 leading-snug">{program.nextModule}</p>
                       </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-auto">
                  {program.status !== 'Terminé' && (
                    <>
                      <button className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl transition-colors">
                        Continuer
                      </button>
                      <button 
                        onClick={() => { setSelectedProgramId(program.id); setIsUnenrollModalOpen(true); }}
                        className="px-4 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 font-bold rounded-xl transition-colors flex items-center justify-center"
                        title="Se désinscrire"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {program.status === 'Terminé' && (
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors">
                      Revoir les cours
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modale de Désinscription */}
      {isUnenrollModalOpen && selectedProgramId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsUnenrollModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up border border-gray-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-sm">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Confirmation</h3>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Êtes-vous sûr de vouloir vous désinscrire de ce programme ? Vous perdrez la trace de votre progression si vous décidez de le rejoindre à nouveau.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsUnenrollModalOpen(false)} 
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={confirmUnenroll} 
                className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

    </StudentLayout>
  )
}
