import { useState, useMemo } from 'react'
import { Head, useForm, usePage, router } from '@inertiajs/react'
import AdminLayout from '~/components/administration/AdminLayout'
import { Plus, Pencil, Trash2, Search, X, Landmark } from 'lucide-react'

export type Ministry = {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function MinisteresIndex() {
  const { ministries } = usePage<{ ministries: Ministry[] }>().props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentMinistry, setCurrentMinistry] = useState<Ministry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    description: '',
  })

  const filteredDepartments = useMemo(() => {
    const list = ministries || []
    return list.filter(dept => 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      dept.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [ministries, searchQuery])

  const openCreateModal = () => {
    setModalMode('create')
    setCurrentMinistry(null)
    reset()
    setIsModalOpen(true)
  }

  const openEditModal = (ministry: Ministry) => {
    setModalMode('edit')
    setCurrentMinistry(ministry)
    setData({
      name: ministry.name,
      description: ministry.description
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalMode === 'create') {
      post('/administration/ministeres', {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    } else {
      put(`/administration/ministeres/${currentMinistry?.id}`, {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ministère ?')) {
      router.delete(`/administration/ministeres/${id}`)
    }
  }

  return (
    <AdminLayout title="Ministères" description="Gérez la liste officielle des ministères et départements de l'académie.">
      <Head title="Ministères — Administration" />

      {/* Actions Rapides */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Rechercher un ministère..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-white text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          onClick={openCreateModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-black hover:bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/30 group ml-auto"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Ajouter un Ministère
        </button>
      </div>

      {/* Tableau des données */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-4 px-6 text-sm font-bold text-gray-700 w-1/3">Nom du Ministère</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700">Description détaillée</th>
                <th className="py-4 px-6 text-sm font-bold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 font-bold text-gray-900 border-l-4 border-transparent group-hover:border-brand-orange">
                    {dept.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 max-w-md lg:max-w-xl truncate">
                    {dept.description}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(dept)}
                        className="p-2 text-gray-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(dept.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredDepartments.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-500">
                    <Landmark className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-600">Aucun ministère trouvé.</p>
                    <p className="text-sm">Essayez de modifier votre recherche.</p>
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
              <Landmark className="w-6 h-6 text-brand-orange" />
              {modalMode === 'create' ? 'Nouveau Ministère' : 'Modifier le Ministère'}
            </h2>
            
            <form className="space-y-5" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom du Ministère</label>
                <input 
                  type="text" 
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                  placeholder="Ex: Ministère de la Famille"
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description / Mission</label>
                <textarea 
                  rows={4}
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all resize-none bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                  placeholder="Décrivez brièvement la mission principale de ce ministère..."
                  required
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
