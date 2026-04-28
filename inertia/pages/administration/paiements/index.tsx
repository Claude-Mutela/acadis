import { useState, useMemo } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import AdminLayout from '../../../components/administration/AdminLayout'
import { 
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, 
  DollarSign, Book, Smartphone, Banknote, Printer, CheckCircle, Clock, ChevronDown, CreditCard
} from 'lucide-react'

type Paiement = {
  id: number
  etudiant: string
  manuel: string
  montant: number
  methode: string
  statut: string
  date: string
  userId: number
  manuelId: number
}

type Student = {
  id: number
  nom: string
  prenom: string
}

type Manuel = {
  id: number
  title: string
  price: number
}

interface Props {
  initialPayments: Paiement[]
  studentsList: Student[]
  manuelsList: Manuel[]
}

export default function PaiementsIndex({ initialPayments, studentsList, manuelsList }: Props) {
  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    userId: 0,
    manuelId: manuelsList[0]?.id || 0,
    montant: 0,
  })
  const payments = initialPayments
  
  // États de recherche et filtre
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  // États pour les Modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentPayment, setCurrentPayment] = useState<Paiement | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // États pour le Combobox Étudiant
  const [studentSearch, setStudentSearch] = useState('')
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)

  // ── Statistiques ─────────────────────────────────────────────────────────────
  const totalEncaissé = payments.reduce((acc, curr) => acc + curr.montant, 0)
  const manuelsVendus = payments.length
  const totalMobileMoney = payments.filter(p => p.methode === 'Mobile Money').reduce((acc, curr) => acc + curr.montant, 0)
  const totalCash = payments.filter(p => p.methode === 'Cash').reduce((acc, curr) => acc + curr.montant, 0)
  const totalCard = payments.filter(p => p.methode === 'Card').reduce((acc, curr) => acc + curr.montant, 0)

  // ── Logique Métier (Filtrage & Pagination) ──────────────────────────────────
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchSearch = 
        payment.etudiant.toLowerCase().includes(search.toLowerCase()) || 
        payment.manuel.toLowerCase().includes(search.toLowerCase()) ||
        payment.id.toString().includes(search)
      
      const matchFilter = filterStatut === 'Tous' || payment.statut === filterStatut
      
      return matchSearch && matchFilter
    })
  }, [payments, search, filterStatut])

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPayments, currentPage])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const filteredStudentsForDropdown = useMemo(() => {
    return studentsList.filter(s => 
      `${s.prenom} ${s.nom}`.toLowerCase().includes(studentSearch.toLowerCase())
    )
  }, [studentSearch, studentsList])

  const selectedManuel = useMemo(() => {
    return manuelsList.find(m => m.id === data.manuelId)
  }, [data.manuelId, manuelsList])

  // ── Actions CRUD ─────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setModalMode('create')
    setStudentSearch('')
    reset()
    clearErrors()
    setIsModalOpen(true)
  }

  const openEditModal = (payment: Paiement) => {
    setModalMode('edit')
    setStudentSearch(payment.etudiant)
    setCurrentPayment(payment)
    setData({
      userId: payment.userId,
      manuelId: payment.manuelId,
      montant: payment.montant,
    })
    clearErrors()
    setIsModalOpen(true)
  }

  const handleDeletePrompt = (payment: Paiement) => {
    setCurrentPayment(payment)
    setIsDeleteModalOpen(true)
  }

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedManuel && data.montant > selectedManuel.price) {
      // Inline validation if needed, but we also have server-side
      return
    }

    if (modalMode === 'create') {
      post('/administration/paiements', {
        onSuccess: () => setIsModalOpen(false),
      })
    } else if (currentPayment) {
      put(`/administration/paiements/${currentPayment.id}`, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  const confirmDelete = () => {
    if (currentPayment) {
      router.delete(`/administration/paiements/${currentPayment.id}`, {
        onSuccess: () => {
          setIsDeleteModalOpen(false)
          setCurrentPayment(null)
        }
      })
    }
  }

  // ── Rendu de l'UI ────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Paiements" description="Caisse et suivi des ventes de manuels pour les étudiants.">
      <Head title="Paiements — Admin ACADIS" />
      
      {/* Actions Rapides (Recherche, Filtre, Ajout) */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 relative w-full md:max-w-md">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par étudiant, ID..."
            value={search}
            onChange={handleSearch}
            className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm transition-colors"
          />
        </div>
        
        <div className="w-full md:w-64 relative">
          <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterStatut}
            onChange={e => { setFilterStatut(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm font-medium text-gray-700 cursor-pointer appearance-none"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Complet">Complet</option>
            <option value="Acompte">Acompte</option>
          </select>
        </div>

        <button 
          onClick={openCreateModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5 ml-auto"
        >
          <Plus className="w-5 h-5" />
          Encaisser un paiement
        </button>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Mois en cours</p>
            <p className="text-2xl font-black text-gray-900">${totalEncaissé}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange/10 text-orange rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Mobile Money</p>
            <p className="text-2xl font-black text-gray-900">${totalMobileMoney}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Carte (Card)</p>
            <p className="text-2xl font-black text-gray-900">${totalCard}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Cash</p>
            <p className="text-2xl font-black text-gray-900">${totalCash}</p>
          </div>
        </div>
      </div>


      {/* Tableau Global (Card) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Transaction / Date</th>
                <th className="px-6 py-4">Étudiant</th>
                <th className="px-6 py-4">Achat (Manuel)</th>
                <th className="px-6 py-4">Montant & Mode</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">#{payment.id}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{payment.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-700">{payment.etudiant}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700">
                        <Book className="w-3.5 h-3.5 text-gray-400" />
                        {payment.manuel}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-gray-900">${payment.montant.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                        {payment.methode === 'Mobile Money' ? <Smartphone className="w-3 h-3" /> : 
                         payment.methode === 'Card' ? <CreditCard className="w-3 h-3" /> : 
                         <Banknote className="w-3 h-3" />}
                        {payment.methode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                        payment.statut === 'Complet' ? 'bg-green-100 text-green-700 border border-green-200' :
                        'bg-orange/20 text-orange border border-orange/20'
                      }`}>
                        {payment.statut === 'Complet' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {payment.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-1.5 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Imprimer Reçu"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(payment)}
                          className="p-1.5 bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePrompt(payment)}
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
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    Aucune transaction trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-sm text-gray-500">
              Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredPayments.length)} sur {filteredPayments.length} transactions
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

      {/* Modal Formulaire (Ajout / Modification) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange" />
                {modalMode === 'create' ? 'Nouvel Encaissement' : 'Modifier Paiement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="p-6 space-y-5 overflow-visible">
              
              <div className="relative z-50">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom de l'étudiant</label>
                <div className="relative">
                  <input 
                    type="text" required placeholder="Rechercher et sélectionner un étudiant..."
                    value={studentSearch} 
                    onChange={e => {
                      setStudentSearch(e.target.value)
                      setIsStudentDropdownOpen(true)
                    }}
                    onFocus={() => setIsStudentDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsStudentDropdownOpen(false), 200)}
                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.userId ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all pr-10`}
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  
                  {isStudentDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 py-1">
                      {filteredStudentsForDropdown.length > 0 ? (
                        filteredStudentsForDropdown.map(s => (
                          <div 
                            key={s.id} 
                            className="px-4 py-2.5 hover:bg-orange/10 cursor-pointer text-sm font-medium text-gray-700 hover:text-orange transition-colors"
                            onMouseDown={() => {
                              const fullName = `${s.prenom} ${s.nom}`
                              setStudentSearch(fullName)
                              setData('userId', s.id)
                              setIsStudentDropdownOpen(false)
                            }}
                          >
                            {s.prenom} <span className="font-bold">{s.nom}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 italic text-center">Aucun étudiant trouvé</div>
                      )}
                    </div>
                  )}
                </div>
                {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Manuel Vendu</label>
                <select 
                  value={data.manuelId} 
                  onChange={e => setData('manuelId', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                >
                  {manuelsList.map(m => (
                    <option key={m.id} value={m.id}>{m.title} ({m.price} $)</option>
                  ))}
                </select>
              </div>

              <div className="relative z-0">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Montant ($)</label>
                <input 
                  type="number" required min="1" step="any"
                  value={data.montant} 
                  onChange={e => setData('montant', parseFloat(e.target.value))}
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.montant || (selectedManuel && data.montant > selectedManuel.price) ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all font-bold`}
                />
                {(selectedManuel && data.montant > selectedManuel.price) && (
                  <p className="text-red-500 text-xs mt-1">Le montant ne peut pas être supérieur au prix du manuel ({selectedManuel.price} $)</p>
                )}
                {errors.montant && <p className="text-red-500 text-xs mt-1">{errors.montant}</p>}
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={processing || (selectedManuel && data.montant > selectedManuel.price)} className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  {modalMode === 'create' ? 'Encaisser' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {isDeleteModalOpen && currentPayment && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Annuler la transaction ?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer ce paiement de <strong>${currentPayment.montant}</strong> pour <strong>{currentPayment.etudiant}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
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
