import { useState, useMemo } from 'react'
import { Head } from '@inertiajs/react'
import AdminLayout from '../../../components/administration/AdminLayout'
import { 
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, 
  Building2, UserCircle2, Shield
} from 'lucide-react'

// ── Mock Data ─────────────────────────────────────────────────────────────────
const initialFormateurs = [
  { id: 1, nom: 'MBUMA', prenom: 'Athoms', titre: 'Docteur', egliseAttache: 'Phila CE', sexe: 'M', specialisation: 'Louange, Leadership' },
  { id: 2, nom: 'MBALA', prenom: 'Blonsky', titre: 'Pasteur', egliseAttache: 'Phila MDT', sexe: 'M', specialisation: 'Prière, Famille' },
  { id: 3, nom: 'TUNASI', prenom: 'Marcello', titre: 'Pasteur', egliseAttache: 'Compassion', sexe: 'M', specialisation: 'Sanctification, Doctrine' },  
  { id: 4, nom: 'DALO', prenom: 'Roland', titre: 'Apôtre', egliseAttache: 'Communauté Philadelphie', sexe: 'M', specialisation: 'Théologie dogmatique, Doctrine' },  
]

type FormateurInfo = typeof initialFormateurs[0]

// ── Component ─────────────────────────────────────────────────────────────────
export default function FormateursIndex() {
  const [formateurs, setFormateurs] = useState<FormateurInfo[]>(initialFormateurs)
  
  const [search, setSearch] = useState('')
  const [filterSexe, setFilterSexe] = useState('Tous')
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentFormateur, setCurrentFormateur] = useState<FormateurInfo | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // ── Filtrage & Pagination ──────────────────────────────────────────────────
  const filteredFormateurs = useMemo(() => {
    return formateurs.filter(f => {
      const matchSearch = 
        f.nom.toLowerCase().includes(search.toLowerCase()) || 
        f.prenom.toLowerCase().includes(search.toLowerCase()) ||
        f.specialisation.toLowerCase().includes(search.toLowerCase())
      
      const matchFilter = filterSexe === 'Tous' || f.sexe === filterSexe
      
      return matchSearch && matchFilter
    })
  }, [formateurs, search, filterSexe])

  const totalPages = Math.ceil(filteredFormateurs.length / itemsPerPage)
  const paginatedFormateurs = filteredFormateurs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // ── Actions CRUD ─────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setModalMode('create')
    setCurrentFormateur({ 
      id: 0, 
      nom: '', 
      prenom: '', 
      titre: 'Pasteur', 
      egliseAttache: '', 
      sexe: 'M', 
      specialisation: '' 
    })
    setIsModalOpen(true)
  }

  const openEditModal = (formateur: FormateurInfo) => {
    setModalMode('edit')
    setCurrentFormateur({ ...formateur })
    setIsModalOpen(true)
  }

  const handleDeletePrompt = (formateur: FormateurInfo) => {
    setCurrentFormateur(formateur)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentFormateur) return

    if (modalMode === 'create') {
      const newId = formateurs.length > 0 ? Math.max(...formateurs.map(f => f.id)) + 1 : 1
      setFormateurs([{ ...currentFormateur, id: newId }, ...formateurs])
    } else {
      setFormateurs(formateurs.map(f => f.id === currentFormateur.id ? currentFormateur : f))
    }
    setIsModalOpen(false)
  }

  const confirmDelete = () => {
    if (currentFormateur) {
      setFormateurs(formateurs.filter(f => f.id !== currentFormateur.id))
      setIsDeleteModalOpen(false)
      setCurrentFormateur(null)
    }
  }

  // ── Rendu de l'UI ────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Formateurs">
      <Head title="Formateurs — Admin ACADIS" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Corps Professoral</h1>
          <p className="text-gray-500 mt-1">Gérez la liste des enseignants et prédicateurs de l'académie.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Ajouter un formateur
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher par nom, spécialisation..."
            value={search} onChange={handleSearch}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange text-sm transition-colors"
          />
        </div>
        
        <div className="sm:w-56 relative">
          <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterSexe} onChange={e => { setFilterSexe(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-orange text-sm font-medium text-gray-700 cursor-pointer appearance-none"
          >
            <option value="Tous">Tous les sexes</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
      </div>

      {/* Tableau Listing */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Nom et Prénom</th>
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4">Église d'attache</th>
                <th className="px-6 py-4">Spécialisation</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedFormateurs.length > 0 ? paginatedFormateurs.map((formateur) => (
                <tr key={formateur.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange font-black">
                        {formateur.prenom[0]}{formateur.nom[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{formateur.prenom} {formateur.nom}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{formateur.sexe === 'M' ? 'Homme' : 'Femme'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-blue-50 text-blue-700 border-blue-100">
                      <Shield className="w-3.5 h-3.5" />
                      {formateur.titre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-700 text-sm font-medium">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {formateur.egliseAttache}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formateur.specialisation}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(formateur)} className="p-1.5 bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeletePrompt(formateur)} className="p-1.5 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Aucun formateur trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-sm text-gray-500">Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredFormateurs.length)} sur {filteredFormateurs.length}</span>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modale Formulaire (Ajout / Modification) ── */}
      {isModalOpen && currentFormateur && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
            
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <UserCircle2 className="w-5 h-5 text-orange" />
                {modalMode === 'create' ? 'Ajouter un formateur' : 'Modifier le profil'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom</label>
                  <input 
                    type="text" required value={currentFormateur.prenom} 
                    onChange={e => setCurrentFormateur({...currentFormateur, prenom: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom de famille</label>
                  <input 
                    type="text" required value={currentFormateur.nom} 
                    onChange={e => setCurrentFormateur({...currentFormateur, nom: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Titre</label>
                  <select 
                    required value={currentFormateur.titre} 
                    onChange={e => setCurrentFormateur({...currentFormateur, titre: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange appearance-none outline-none"
                  >
                    <option value="Pasteur">Pasteur</option>
                    <option value="Docteur">Docteur</option>
                    <option value="Frère">Frère</option>
                    <option value="Sœur">Sœur</option>
                    <option value="Évangéliste">Évangéliste</option>
                    <option value="Prophète">Prophète</option>
                    <option value="Intercesseur">Intercesseur</option>
                    <option value="Maman">Maman</option>
                  </select>
                </div>

                {/* Sexe */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Sexe</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    {['M', 'F'].map(sexe => (
                      <label key={sexe} className="cursor-pointer">
                        <input 
                          type="radio" name="sexe" value={sexe} checked={currentFormateur.sexe === sexe}
                          onChange={e => setCurrentFormateur({...currentFormateur, sexe: e.target.value})} className="sr-only peer"
                        />
                        <div className="text-center py-2 px-1 text-xs font-bold text-gray-500 rounded-lg peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm transition-all">
                          {sexe === 'M' ? 'Homme' : 'Femme'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Église */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Église d'attache</label>
                  <input 
                    type="text" required value={currentFormateur.egliseAttache} placeholder="Ex: Église Compassion"
                    onChange={e => setCurrentFormateur({...currentFormateur, egliseAttache: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                </div>

                {/* Spécialisation */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Spécialisation (Enseignements)</label>
                  <input 
                    type="text" required value={currentFormateur.specialisation} placeholder="Ex: Dogmatique, Leadership biblique, Prière"
                    onChange={e => setCurrentFormateur({...currentFormateur, specialisation: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Séparez les domaines par des virgules.</p>
                </div>

              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Annuler</button>
                 <button type="submit" className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform">
                   {modalMode === 'create' ? 'Ajouter ce formateur' : 'Enregistrer'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Suppression Générique ── */}
      {isDeleteModalOpen && currentFormateur && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Supprimer ce formateur ?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Voulez-vous vraiment retirer le profil de <strong>{currentFormateur.titre} {currentFormateur.prenom} {currentFormateur.nom}</strong> du portail ?
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
