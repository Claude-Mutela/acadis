import { useState, useMemo } from 'react'
import { Head, useForm, usePage, router } from '@inertiajs/react'
import AdminLayout from '../../../components/administration/AdminLayout'
import { 
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, User, Mail, Shield, Phone, Eye, EyeOff
} from 'lucide-react'

const rolesList = ['Tous', 'superadmin', 'admin', 'trainer', 'student']
const statusList = ['Tous', 'active', 'inactive', 'suspended']

// ── Types ──────────────────────────────────────────────────────────────────────
export type UserData = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  createdAt: string
  profile?: { phone: string | null }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function UsersIndex() {
  const { users } = usePage<{ users: UserData[] }>().props
  
  // États de recherche et filtre
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('Tous')
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  // États pour les Modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentUser, setCurrentUser] = useState<UserData & { password?: string } | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // ── Logique Métier (Filtrage & Pagination) ──────────────────────────────────
  const filteredUsers = useMemo(() => {
    const list = users || []
    return list.filter(user => {
      const matchSearch = 
        user.lastName.toLowerCase().includes(search.toLowerCase()) || 
        user.firstName.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
      
      const matchRole = filterRole === 'Tous' || user.role === filterRole
      
      return matchSearch && matchRole
    })
  }, [users, search, filterRole])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage])

  // Reset page relative to filters
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value)
    setCurrentPage(1)
  }

  // ── Actions CRUD ─────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setModalMode('create')
    setCurrentUser({ 
      id: 0, firstName: '', lastName: '', email: '', 
      role: 'student', status: 'active', createdAt: new Date().toISOString()
    } as UserData)
    setData({ firstName: '', lastName: '', email: '', password: '', role: 'student', status: 'active' })
    setIsModalOpen(true)
    setShowPassword(false)
  }

  const openEditModal = (user: UserData) => {
    setModalMode('edit')
    setCurrentUser({ ...user, password: '' } as any)
    setData({ firstName: user.firstName, lastName: user.lastName, email: user.email, password: '', role: user.role as any, status: user.status as any })
    setIsModalOpen(true)
    setShowPassword(false)
  }

  const handleDeletePrompt = (user: UserData) => {
    setCurrentUser(user)
    setIsDeleteModalOpen(true)
  }
  // ── Formulaire ─────────────────────────────────────────────────────────────
  const { data, setData, post, put, processing, errors } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student' as 'superadmin' | 'admin' | 'student' | 'trainer',
    status: 'active' as 'active' | 'inactive' | 'suspended',
  })

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    if (modalMode === 'create') {
      post('/administration/utilisateurs', {
        onSuccess: () => setIsModalOpen(false),
      })
    } else {
      put(`/administration/utilisateurs/${currentUser.id}`, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  const confirmDelete = () => {
    if (currentUser) {
      router.delete(`/administration/utilisateurs/${currentUser.id}`, {
        onSuccess: () => {
          setIsDeleteModalOpen(false)
          setCurrentUser(null)
        }
      })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'superadmin': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'admin': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'trainer': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      case 'suspended': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // ── Rendu de l'UI ────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Gestion des Utilisateurs">
      <Head title="Utilisateurs — Admin ACADIS" />
      
      {/* 1. Header de Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">Gérez les accès et les profils des membres de la plateforme.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* 2. Barre de Recherche et Filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={search}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm transition-colors"
          />
        </div>
        
        <div className="sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            value={filterRole}
            onChange={handleFilter}
            className="block w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm font-medium text-gray-700 cursor-pointer appearance-none"
          >
            {rolesList.map(role => (
              <option key={role} value={role}>{role === 'Tous' ? 'Tous les rôles' : role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Tableau Global (Card) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold text-sm flex-shrink-0 uppercase">
                          {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 font-medium">{user.profile?.phone || '—'}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(user.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'active' ? 'bg-green-500' :
                          user.status === 'inactive' ? 'bg-gray-400' :
                          'bg-red-500'
                        }`} />
                        {user.status === 'active' ? 'Actif' : user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-1.5 bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePrompt(user)}
                          className="p-1.5 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Aucun utilisateur ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-sm text-gray-500">
              Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1 font-medium text-sm">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-black text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Modal Formulaire (Ajout / Modification) */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                {modalMode === 'create' ? <Plus className="w-5 h-5 text-orange" /> : <Edit2 className="w-5 h-5 text-orange" />}
                {modalMode === 'create' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form id="userUpdateForm" onSubmit={handleSaveUser} method="POST" className="space-y-6">
                
                {/* Informations de base */}
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Informations Personnelles</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" required
                          value={data.firstName} 
                          onChange={e => setData('firstName', e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none"
                        />
                      </div>
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" required
                          value={data.lastName} 
                          onChange={e => setData('lastName', e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none"
                        />
                      </div>
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="email" required
                          value={data.email} 
                          onChange={e => setData('email', e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Accès et Rôles */}
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Accès et Rôles</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Rôle Système</label>
                      <div className="relative">
                        <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select 
                          value={data.role} 
                          onChange={e => setData('role', e.target.value as any)}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none appearance-none cursor-pointer"
                        >
                          <option value="student">Étudiant (Student)</option>
                          <option value="trainer">Formateur (Trainer)</option>
                          <option value="admin">Administrateur (Admin)</option>
                          <option value="superadmin">Super Administrateur</option>
                        </select>
                      </div>
                      {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Statut du Compte</label>
                      <select 
                        value={data.status} 
                        onChange={e => setData('status', e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none appearance-none cursor-pointer"
                      >
                         <option value="active">Actif</option>
                         <option value="inactive">Inactif</option>
                         <option value="suspended">Suspendu</option>
                      </select>
                      {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                    </div>
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Sécurité</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        {modalMode === 'create' ? 'Mot de passe initial' : 'Nouveau mot de passe (laisser vide pour ne pas changer)'}
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          placeholder={modalMode === 'create' ? "••••••••" : "Ne pas modifier"}
                          value={data.password}
                          onChange={e => setData('password', e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                      <p className="text-[10px] text-gray-400 mt-1.5">
                        {modalMode === 'create' ? 'Un mot de passe fort est recommandé.' : 'Si vous renseignez ce champ, le mot de passe de l\'utilisateur sera mis à jour.'}
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 flex-shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors">
                Annuler
              </button>
              <button type="submit" form="userUpdateForm" disabled={processing} className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed">
                {processing ? 'Enregistrement...' : modalMode === 'create' ? 'Créer l\'utilisateur' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal Suppression */}
      {isDeleteModalOpen && currentUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Supprimer l'utilisateur ?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>{currentUser.firstName} {currentUser.lastName}</strong> ? Cette action supprimera également son profil et ses accès.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors">
                Annuler
              </button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}
