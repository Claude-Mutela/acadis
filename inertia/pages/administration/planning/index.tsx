import { useState, useMemo } from 'react'
import { Head } from '@inertiajs/react'
import AdminLayout from '../../../components/administration/AdminLayout'
import { 
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, 
  Calendar, Users, BookOpen, CheckCircle, Clock, AlertTriangle, PlayCircle
} from 'lucide-react'

// ── Mock Data ─────────────────────────────────────────────────────────────────
const mockProgrammesList = [
  'Parcours Fondamental',
  'École des Ouvriers',
  'Face à moi-même',
  'Leadership Biblique',
  'Combat Spirituel'
]

const initialSessions = [
  { id: 1, programme: 'Parcours Fondamental', cohorte: 'Promotion 4', dateDebut: '2026-09-15', duree: '6 mois', placesTotales: 50, placesReservees: 24, statut: 'Ouvert aux inscriptions' },
  { id: 2, programme: 'École des Ouvriers', cohorte: 'Hiver 2026', dateDebut: '2026-11-01', duree: '3 mois', placesTotales: 30, placesReservees: 8, statut: 'Ouvert aux inscriptions' },
  { id: 3, programme: 'Leadership Biblique', cohorte: 'Printemps 2026', dateDebut: '2026-03-01', duree: '8 semaines', placesTotales: 25, placesReservees: 25, statut: 'En cours' },
  { id: 4, programme: 'Parcours Fondamental', cohorte: 'Promotion 3', dateDebut: '2025-09-10', duree: '6 mois', placesTotales: 50, placesReservees: 45, statut: 'Terminé' },
  { id: 5, programme: 'Combat Spirituel', cohorte: 'Intensive Juillet', dateDebut: '2026-07-15', duree: '1 mois', placesTotales: 100, placesReservees: 0, statut: 'Annulé' },
]

type SessionInfo = typeof initialSessions[0]

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Ouvert aux inscriptions': return { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-3.5 h-3.5" /> }
    case 'En cours': return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <PlayCircle className="w-3.5 h-3.5" /> }
    case 'Terminé': return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Clock className="w-3.5 h-3.5" /> }
    case 'Annulé': return { color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
    default: return { color: 'bg-gray-100 text-gray-600', icon: <Clock className="w-3 h-3" /> }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PlanningIndex() {
  const [sessions, setSessions] = useState<SessionInfo[]>(initialSessions)
  
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentSession, setCurrentSession] = useState<SessionInfo | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // ── Statistiques ─────────────────────────────────────────────────────────────
  const sessionsOuvertes = sessions.filter(s => s.statut === 'Ouvert aux inscriptions').length
  const totalInscrits = sessions.filter(s => s.statut === 'Ouvert aux inscriptions' || s.statut === 'En cours').reduce((acc, curr) => acc + curr.placesReservees, 0)

  // ── Filtrage & Pagination ──────────────────────────────────────────────────
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchSearch = s.programme.toLowerCase().includes(search.toLowerCase()) || s.cohorte.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filterStatut === 'Tous' || s.statut === filterStatut
      return matchSearch && matchFilter
    })
  }, [sessions, search, filterStatut])

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage)
  const paginatedSessions = filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // ── Actions CRUD ─────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setModalMode('create')
    setCurrentSession({ 
      id: 0, 
      programme: mockProgrammesList[0], 
      cohorte: '', 
      dateDebut: '', 
      duree: '', 
      placesTotales: 50, 
      placesReservees: 0, 
      statut: 'Ouvert aux inscriptions' 
    })
    setIsModalOpen(true)
  }

  const openEditModal = (session: SessionInfo) => {
    setModalMode('edit')
    setCurrentSession({ ...session })
    setIsModalOpen(true)
  }

  const handleDeletePrompt = (session: SessionInfo) => {
    setCurrentSession(session)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentSession) return

    if (modalMode === 'create') {
      const newId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1
      setSessions([{ ...currentSession, id: newId }, ...sessions])
    } else {
      setSessions(sessions.map(s => s.id === currentSession.id ? currentSession : s))
    }
    setIsModalOpen(false)
  }

  const confirmDelete = () => {
    if (currentSession) {
      setSessions(sessions.filter(s => s.id !== currentSession.id))
      setIsDeleteModalOpen(false)
      setCurrentSession(null)
    }
  }

  // ── Rendu de l'UI ────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Planning & Cohortes">
      <Head title="Planning — Admin ACADIS" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Planning & Sessions</h1>
          <p className="text-gray-500 mt-1">Planifiez les ouvertures de vos programmes et gérez les cohortes.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5"
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

      {/* Filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher par programme, cohorte..."
            value={search} onChange={handleSearch}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange text-sm transition-colors"
          />
        </div>
        
        <div className="sm:w-64 relative">
          <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterStatut} onChange={e => { setFilterStatut(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange text-sm font-medium text-gray-700 cursor-pointer appearance-none"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Ouvert aux inscriptions">Ouvert aux inscriptions</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
      </div>

      {/* Tableau Listing */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Programme & Cohorte</th>
                <th className="px-6 py-4">Début & Durée</th>
                <th className="px-6 py-4">Places (Remplissage)</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedSessions.length > 0 ? paginatedSessions.map((session) => {
                const conf = getStatusConfig(session.statut)
                const percent = Math.round((session.placesReservees / session.placesTotales) * 100)
                
                return (
                  <tr key={session.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 inline-flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-gray-400" /> {session.programme}</div>
                      <div className="text-sm font-medium text-orange mt-0.5">{session.cohorte}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-700">{new Date(session.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric'})}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{session.duree}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-gray-700">{session.placesReservees} / {session.placesTotales} inscrits</span>
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
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Aucune session trouvée.</td></tr>
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
      {isModalOpen && currentSession && (
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
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom du Programme</label>
                  <select 
                    required value={currentSession.programme} 
                    onChange={e => setCurrentSession({...currentSession, programme: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange appearance-none outline-none font-bold"
                  >
                    {mockProgrammesList.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Cohorte (ex: M1, Hiver 26)</label>
                  <input 
                    type="text" required value={currentSession.cohorte} placeholder="Ex: Promotion 5"
                    onChange={e => setCurrentSession({...currentSession, cohorte: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Date de début</label>
                  <input 
                    type="date" required value={currentSession.dateDebut} 
                    onChange={e => setCurrentSession({...currentSession, dateDebut: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Durée</label>
                  <input 
                    type="text" required value={currentSession.duree} placeholder="Ex: 6 mois"
                    onChange={e => setCurrentSession({...currentSession, duree: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Places Totales</label>
                  <input 
                    type="number" required min="1" value={currentSession.placesTotales} 
                    onChange={e => setCurrentSession({...currentSession, placesTotales: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Statut de la session</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    {['Ouvert aux inscriptions', 'En cours', 'Terminé', 'Annulé'].map(statut => (
                      <label key={statut} className="cursor-pointer">
                        <input 
                          type="radio" name="statut" value={statut} checked={currentSession.statut === statut}
                          onChange={e => setCurrentSession({...currentSession, statut: e.target.value})} className="sr-only peer"
                        />
                        <div className="text-center py-2 px-1 text-xs font-bold text-gray-500 rounded-lg peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm transition-all">
                          {statut}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Annuler</button>
                 <button type="submit" className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform">
                   {modalMode === 'create' ? 'Planifier cette session' : 'Mettre à jour'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Suppression Générique ── */}
      {isDeleteModalOpen && currentSession && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Supprimer la session ?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Voulez-vous vraiment supprimer la <strong>{currentSession.cohorte}</strong> du programme <strong>{currentSession.programme}</strong> ?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
