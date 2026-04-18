import { useState, useMemo } from 'react'
import { Head, useForm, usePage, router } from '@inertiajs/react'
import AdminLayout from '~/components/administration/AdminLayout'
import { 
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, 
  Building2, UserCircle2, Shield, Mail
} from 'lucide-react'

export type Trainer = {
  id: number
  userId: number
  firstName: string
  lastName: string
  gender: 'M' | 'F'
  title: string
  homeChurch: string
  specialization: string
  user?: {
    email: string
  }
}

export default function FormateursIndex() {
  const { trainers } = usePage<{ trainers: Trainer[] }>().props
  
  const [search, setSearch] = useState('')
  const [filterSexe, setFilterSexe] = useState('Tous')
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentTrainer, setCurrentTrainer] = useState<Trainer | null>(null)
  
  const { data, setData, post, put, processing, errors, reset } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'M' as 'M' | 'F',
    title: 'Pasteur',
    homeChurch: '',
    specialization: '',
  })

  // ── Filtrage & Pagination ──────────────────────────────────────────────────
  const filteredTrainers = useMemo(() => {
    const list = trainers || []
    return list.filter(f => {
      const matchSearch = 
        f.lastName.toLowerCase().includes(search.toLowerCase()) || 
        f.firstName.toLowerCase().includes(search.toLowerCase()) ||
        f.specialization.toLowerCase().includes(search.toLowerCase())
      
      const matchFilter = filterSexe === 'Tous' || f.gender === filterSexe
      
      return matchSearch && matchFilter
    })
  }, [trainers, search, filterSexe])

  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage)
  const paginatedTrainers = filteredTrainers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // ── Actions CRUD ─────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setModalMode('create')
    setCurrentTrainer(null)
    reset()
    setIsModalOpen(true)
  }

  const openEditModal = (trainer: Trainer) => {
    setModalMode('edit')
    setCurrentTrainer(trainer)
    setData({
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      email: trainer.user?.email || '',
      gender: trainer.gender,
      title: trainer.title,
      homeChurch: trainer.homeChurch,
      specialization: trainer.specialization,
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalMode === 'create') {
      post('/administration/formateurs', {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    } else {
      put(`/administration/formateurs/${currentTrainer?.id}`, {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (trainer: Trainer) => {
    if (confirm(`Voulez-vous vraiment supprimer le formateur ${trainer.firstName} ${trainer.lastName} ? cela supprimera aussi son compte utilisateur.`)) {
      router.delete(`/administration/formateurs/${trainer.id}`)
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
          className="flex items-center gap-2 bg-brand-black hover:bg-brand-orange text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-brand-orange/20 transition-all hover:-translate-y-0.5"
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
            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-brand-orange text-sm transition-colors"
          />
        </div>
        
        <div className="sm:w-56 relative">
          <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterSexe} onChange={e => { setFilterSexe(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium text-gray-700 cursor-pointer appearance-none"
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
              {paginatedTrainers.length > 0 ? paginatedTrainers.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-black">
                        {trainer.firstName[0]}{trainer.lastName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{trainer.firstName} {trainer.lastName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{trainer.gender === 'M' ? 'Homme' : 'Femme'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-blue-50 text-blue-700 border-blue-100">
                      <Shield className="w-3.5 h-3.5" />
                      {trainer.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-700 text-sm font-medium">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {trainer.homeChurch}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {trainer.specialization}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(trainer)} className="p-1.5 bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(trainer)} className="p-1.5 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
            <span className="text-sm text-gray-500">Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredTrainers.length)} sur {filteredTrainers.length}</span>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modale Formulaire (Ajout / Modification) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
            
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <UserCircle2 className="w-5 h-5 text-brand-orange" />
                {modalMode === 'create' ? 'Ajouter un formateur' : 'Modifier le profil'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom</label>
                  <input 
                    type="text" required value={data.firstName} 
                    onChange={e => setData('firstName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom de famille</label>
                  <input 
                    type="text" required value={data.lastName} 
                    onChange={e => setData('lastName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                   {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 font-sans flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Adresse Email (Identifiant de connexion)
                  </label>
                  <input 
                    type="email" required value={data.email} placeholder="exemple@acadis.cd"
                    onChange={e => setData('email', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Titre</label>
                  <select 
                    required value={data.title} 
                    onChange={e => setData('title', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange appearance-none outline-none"
                  >
                    <option value="Pasteur">Pasteur</option>
                    <option value="Docteur">Docteur</option>
                    <option value="Mvitu">Mvitu</option>
                    <option value="Frère">Frère</option>
                    <option value="Sœur">Sœur</option>
                    <option value="Évangéliste">Évangéliste</option>
                    <option value="Prophète">Prophète</option>
                    <option value="Apôtre">Apôtre</option>
                    <option value="Maman">Maman</option>
                  </select>
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                {/* Sexe */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Sexe</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    {['M', 'F'].map(sexe => (
                      <label key={sexe} className="cursor-pointer">
                        <input 
                          type="radio" name="gender" value={sexe} checked={data.gender === sexe}
                          onChange={e => setData('gender', e.target.value as 'M' | 'F')} className="sr-only peer"
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
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 font-sans">Église d'attache</label>
                  <input 
                    type="text" required value={data.homeChurch} placeholder="Ex: Église Philadelphie"
                    onChange={e => setData('homeChurch', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                  {errors.homeChurch && <p className="text-red-500 text-xs mt-1">{errors.homeChurch}</p>}
                </div>

                {/* Spécialisation */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 font-sans">Spécialisation (Enseignements)</label>
                  <input 
                    type="text" required value={data.specialization} placeholder="Ex: Dogmatique, Leadership biblique, Prière"
                    onChange={e => setData('specialization', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Séparez les domaines par des virgules.</p>
                  {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                </div>

              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Annuler</button>
                 <button type="submit" disabled={processing} className="flex-1 py-3 bg-brand-black hover:bg-brand-orange text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50">
                   {processing ? 'Chargement...' : (modalMode === 'create' ? 'Ajouter ce formateur' : 'Enregistrer les modifications')}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
