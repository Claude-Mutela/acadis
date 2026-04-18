import { useState, useMemo } from 'react'
import { Head, useForm, usePage, router } from '@inertiajs/react'
import AdminLayout from '~/components/administration/AdminLayout'
import { Plus, Pencil, Trash2, Search, X, Layers } from 'lucide-react'

export type Cohort = {
  id: number
  name: string
  slug: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export default function CohortesIndex() {
  const { cohorts } = usePage<{ cohorts: Cohort[] }>().props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentCohort, setCurrentCohort] = useState<Cohort | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    slug: '',
    startDate: '',
    endDate: '',
  })

  const filteredCohorts = useMemo(() => {
    const list = cohorts || []
    return list.filter(cohort => 
      cohort.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [cohorts, searchQuery])

  const openCreateModal = () => {
    setModalMode('create')
    setCurrentCohort(null)
    reset()
    setIsModalOpen(true)
  }

  const openEditModal = (cohort: Cohort) => {
    setModalMode('edit')
    setCurrentCohort(cohort)
    
    // Format dates for input type="date"
    const start = cohort.startDate ? new Date(cohort.startDate).toISOString().split('T')[0] : ''
    const end = cohort.endDate ? new Date(cohort.endDate).toISOString().split('T')[0] : ''

    setData({
      name: cohort.name,
      slug: cohort.slug,
      startDate: start,
      endDate: end
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalMode === 'create') {
      post('/administration/cohortes', {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    } else {
      put(`/administration/cohortes/${currentCohort?.id}`, {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette cohorte ?')) {
      router.delete(`/administration/cohortes/${id}`)
    }
  }

  return (
    <AdminLayout title="Gestion des Cohortes">
      <Head title="Cohortes — Administration" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Layers className="w-8 h-8 text-brand-orange" />
            Cohortes
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les différentes promotions et périodes de formation.</p>
        </div>
        
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-brand-black hover:bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/30 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Ajouter une Cohorte
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher une cohorte..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des données */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-4 px-6 text-sm font-bold text-gray-700 w-1/3">Nom de la Cohorte</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Période</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Slug</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCohorts.map((cohort) => (
                <tr key={cohort.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 font-bold text-gray-900 border-l-4 border-transparent group-hover:border-brand-orange">
                    {cohort.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold mr-2">
                       Début: {new Date(cohort.startDate).toLocaleDateString()}
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
                       Fin: {new Date(cohort.endDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400 font-mono italic">
                    {cohort.slug}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(cohort)}
                        className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cohort.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredCohorts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    <Layers className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-600">Aucune cohorte trouvée.</p>
                    <p className="text-sm">Vérifiez la connexion au backend ou modifiez votre recherche.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale d'Action (Ajout/Édition) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 lg:p-8 animate-fade-in-up">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Layers className="w-6 h-6 text-brand-orange" />
              {modalMode === 'create' ? 'Nouvelle Cohorte' : 'Modifier la Cohorte'}
            </h2>
            
            <form className="space-y-5" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom de la Cohorte</label>
                <input 
                  type="text" 
                  value={data.name}
                  onChange={e => {
                    const name = e.target.value
                    const slug = name
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_-]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                    
                    setData(data => ({ ...data, name, slug }))
                  }}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                  placeholder="Ex: Cohorte 2024 - Session A"
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slug (Automatique)</label>
                <input 
                  type="text" 
                  value={data.slug}
                  readOnly
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed font-mono text-sm"
                  placeholder="nom-de-la-cohorte"
                />
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Généré à partir du nom</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date de début</label>
                  <input 
                    type="date" 
                    value={data.startDate}
                    onChange={e => setData('startDate', e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                    required
                  />
                  {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date de fin</label>
                  <input 
                    type="date" 
                    value={data.endDate}
                    onChange={e => setData('endDate', e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                    required
                  />
                  {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                </div>
              </div>
              
              <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={processing}
                  className="px-6 py-3 bg-brand-black hover:bg-brand-orange text-white font-bold rounded-xl transition-colors shadow-md shadow-brand-orange/20 disabled:opacity-50"
                >
                  {processing ? 'Enregistrement...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
