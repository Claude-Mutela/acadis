import { useState, useMemo } from 'react'
import { Head, usePage, useForm } from '@inertiajs/react'
import AdminLayout from '../../../components/administration/AdminLayout'
import { 
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, 
  Calendar, Users, BookOpen, CheckCircle, Clock, AlertTriangle, PlayCircle
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────
interface CohortProp {
  id: number
  name: string
  programs: string
}

interface PlanningProp {
  id: number
  cohortId: number
  programme: string
  cohorte: string
  dateDebut: string
  dateFin: string
  type: string
  placesTotales: number
  placesReservees: number
  statut: string
}

interface PageProps {
  plannings: PlanningProp[]
  cohorts: CohortProp[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Inscriptions': return { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-3.5 h-3.5" /> }
    case 'En cours': return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <PlayCircle className="w-3.5 h-3.5" /> }
    case 'Terminé': return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Clock className="w-3.5 h-3.5" /> }
    case 'Annulé': return { color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
    default: return { color: 'bg-gray-100 text-gray-600', icon: <Clock className="w-3 h-3" /> }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PlanningIndex() {
  const { plannings, cohorts } = usePage<any>().props as { plannings: PlanningProp[], cohorts: CohortProp[] }
  
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [planningToDelete, setPlanningToDelete] = useState<PlanningProp | null>(null)

  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    id: 0,
    cohortId: '',
    startDate: '',
    endDate: '',
    type: 'présentiel',
    capacity: 50,
    status: 'Inscriptions'
  })

  // ── Statistiques ─────────────────────────────────────────────────────────────
  const sessionsOuvertes = plannings.filter(s => s.statut === 'Inscriptions').length
  const totalInscrits = plannings.filter(s => s.statut === 'Inscriptions' || s.statut === 'En cours').reduce((acc, curr) => acc + curr.placesReservees, 0)

  // ── Filtrage & Pagination ──────────────────────────────────────────────────
  const filteredSessions = useMemo(() => {
    return plannings.filter(s => {
      const matchSearch = s.programme.toLowerCase().includes(search.toLowerCase()) || s.cohorte.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filterStatut === 'Tous' || s.statut === filterStatut
      return matchSearch && matchFilter
    })
  }, [plannings, search, filterStatut])

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage)
  const paginatedSessions = filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // ── Actions CRUD ─────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setModalMode('create')
    clearErrors()
    reset()
    if(cohorts.length > 0) {
      setData('cohortId', cohorts[0].id.toString())
    }
    setIsModalOpen(true)
  }

  const openEditModal = (planning: PlanningProp) => {
    setModalMode('edit')
    clearErrors()
    setData({
      id: planning.id,
      cohortId: planning.cohortId?.toString() || '',
      startDate: planning.dateDebut || '',
      endDate: planning.dateFin || '',
      type: planning.type || 'présentiel',
      capacity: planning.placesTotales || 0,
      status: planning.statut || 'Inscriptions'
    })
    setIsModalOpen(true)
  }

  const handleDeletePrompt = (planning: PlanningProp) => {
    setPlanningToDelete(planning)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (modalMode === 'create') {
      post('/administration/planning', {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    } else {
      put(`/administration/planning/${data.id}`, {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    }
  }

  const confirmDelete = () => {
    if (planningToDelete) {
      destroy(`/administration/planning/${planningToDelete.id}`, {
        onSuccess: () => {
          setIsDeleteModalOpen(false)
          setPlanningToDelete(null)
        }
      })
    }
  }

  // ── Rendu de l'UI ────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Planning" description="Planifiez les ouvertures de vos programmes et gérez les cohortes.">
      <Head title="Planning — Admin ACADIS" />
      
      {/* Actions Rapides (Recherche, Filtre, Ajout) */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 relative w-full md:max-w-md">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher par programme, cohorte..."
            value={search} onChange={handleSearch}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange text-sm transition-colors"
          />
        </div>
        
        <div className="w-full md:w-64 relative">
          <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterStatut} onChange={e => { setFilterStatut(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange text-sm font-medium text-gray-700 cursor-pointer appearance-none"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Inscriptions">Inscriptions</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>

        <button 
          onClick={openCreateModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5 ml-auto"
        >
          <Calendar className="w-5 h-5" />
          Planifier une session
        </button>
      </div>

      {/* Cartes Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Ouvertes aux inscriptions</p>
            <p className="text-2xl font-black text-gray-900">{sessionsOuvertes} Session(s)</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Apprenants actifs ou attendus</p>
            <p className="text-2xl font-black text-gray-900">{totalInscrits}</p>
          </div>
        </div>
      </div>


      {/* Tableau Listing */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Programme & Cohorte</th>
                <th className="px-6 py-4">Période</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Places</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedSessions.length > 0 ? paginatedSessions.map((session) => {
                const conf = getStatusConfig(session.statut)
                const percent = session.placesTotales > 0 ? Math.round((session.placesReservees / session.placesTotales) * 100) : 0
                
                return (
                  <tr key={session.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 inline-flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-gray-400" /> {session.programme}</div>
                      <div className="text-sm font-medium text-orange mt-0.5">{session.cohorte}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-700">{session.dateDebut ? new Date(session.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric'}) : '-'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">au {session.dateFin ? new Date(session.dateFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric'}) : '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="capitalize text-sm font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{session.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-gray-700">{session.placesReservees} / {session.placesTotales}</span>
                        <span className={percent >= 100 ? 'text-red-500' : 'text-gray-500'}>{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-orange' : 'bg-green-500'}`} 
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${conf.color}`}>
                        {conf.icon} {session.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(session)} className="p-1.5 bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeletePrompt(session)} className="p-1.5 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Aucune session trouvée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-sm text-gray-500">Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredSessions.length)} sur {filteredSessions.length}</span>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modale Formulaire (Ajout / Modification) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
            
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange" />
                {modalMode === 'create' ? 'Planifier une session' : 'Modifier la session'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Cohorte */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Sélectionner la Cohorte</label>
                  {cohorts.length === 0 ? (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm border border-yellow-200">
                      Vous n'avez aucune cohorte. Veuillez d'abord en créer une.
                    </div>
                  ) : (
                    <>
                      <select 
                        required value={data.cohortId} 
                        onChange={e => setData('cohortId', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none font-bold text-gray-700"
                      >
                        <option value="" disabled>-- Choisir une cohorte --</option>
                        {cohorts.map(c => (
                          <option key={c.id} value={c.id}>{c.name} {c.programs ? `(Prog: ${c.programs})` : ''}</option>
                        ))}
                      </select>
                      {errors.cohortId && <p className="text-red-500 text-xs mt-1">{errors.cohortId}</p>}
                    </>
                  )}
                </div>

                {/* Date de début */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Date de début</label>
                  <input 
                    type="date" required value={data.startDate} 
                    onChange={e => setData('startDate', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                  {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                </div>

                {/* Date de fin */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Date de fin</label>
                  <input 
                    type="date" required value={data.endDate} 
                    onChange={e => setData('endDate', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                  {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Type de session</label>
                  <select 
                    required value={data.type} 
                    onChange={e => setData('type', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none font-bold"
                  >
                    <option value="présentiel">Présentiel</option>
                    <option value="en ligne">En ligne</option>
                    <option value="hybride">Hybride</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>

                {/* Places Totales */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Places Totales (Capacité)</label>
                  <input 
                    type="number" required min="1" value={data.capacity} 
                    onChange={e => setData('capacity', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                  {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                </div>

                {/* Statut */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Statut de la session</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    {['Inscriptions', 'En cours', 'Terminé', 'Annulé'].map(statut => (
                      <label key={statut} className="cursor-pointer">
                        <input 
                          type="radio" name="statut" value={statut} checked={data.status === statut}
                          onChange={e => setData('status', e.target.value)} className="sr-only peer"
                        />
                        <div className="text-center py-2 px-1 text-xs font-bold text-gray-500 rounded-lg peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm transition-all">
                          {statut}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Annuler</button>
                 <button type="submit" disabled={processing} className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform disabled:opacity-50">
                   {processing ? 'Chargement...' : modalMode === 'create' ? 'Planifier cette session' : 'Mettre à jour'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Suppression Générique ── */}
      {isDeleteModalOpen && planningToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Supprimer la session ?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Voulez-vous vraiment supprimer la session pour la cohorte <strong>{planningToDelete.cohorte}</strong> ?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Annuler</button>
              <button onClick={confirmDelete} disabled={processing} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors disabled:opacity-50">
                {processing ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
