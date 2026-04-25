import { useState, useMemo, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import AdminLayout from '../../../components/administration/AdminLayout'
import { 
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, User, Mail, BookOpen, Clock, Phone, Home, Globe
} from 'lucide-react'

interface StudentProp {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  eglise: string
  ministere: string
  programme: string
  session: string
  type: string
  statut: string
  cohort: string
  estOuvrier: boolean
  departement: string
  vacation: string
}

interface PageProps {
  students: any[]
  filters: {
    cohorts: any[]
    allPrograms: any[]
    departments: any[]
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function EtudiantsIndex({ students: rawStudents, filters }: PageProps) {
  // ── Formatage des données (Logicielle de présentation) ──────────────────────
  const students = useMemo((): StudentProp[] => {
    return rawStudents.map((student: any) => {
      const profile = student.studentProfile
      const latestEnrollment = student.enrollments?.[0]
      const planning = latestEnrollment?.planning
      const cohort = planning?.cohorts?.[0]
      const program = latestEnrollment?.program
      const vacation = latestEnrollment?.vacation

      return {
        id: student.id,
        nom: student.lastName,
        prenom: student.firstName,
        email: student.email,
        telephone: profile?.phoneNumber || '-',
        eglise: profile?.homeChurch || '-',
        ministere: profile?.ministry || '-',
        programme: program?.name || 'Non inscrit',
        session: vacation ? `${vacation.day} (${vacation.startTime} - ${vacation.endTime})` : '-',
        type: planning?.type || '-',
        statut: latestEnrollment?.status || 'Aucun',
        cohort: cohort?.name || '-',
        estOuvrier: profile?.worker === 'Oui',
        departement: profile?.ministry || '-',
        vacation: vacation?.day || '-',
      }
    })
  }, [rawStudents])

  const formattedCohorts = useMemo(() => {
    return filters.cohorts.map((c) => ({
      id: c.id,
      name: c.name,
      programNames: Array.from(new Set(c.programs?.map((p: any) => p.name) || []))
    }))
  }, [filters.cohorts])

  // États de recherche et filtre
  const [search, setSearch] = useState('')
  const [filterCohort, setFilterCohort] = useState('Tous')
  const [filterProgramme, setFilterProgramme] = useState('Tous')
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentStudent, setCurrentStudent] = useState<StudentProp | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // État du formulaire d'inscription
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'M',
    homeChurch: '',
    worker: false,
    ministry: '',
    address: '',
    phoneNumber: '',
    dateOfBirth: '',
    cohortId: '',
    programId: '',
    planningId: '',
    vacationId: '',
    status: 'pending'
  })

  // ── Logique des Filtres Dynamiques (Modale) ──────────────────────────────
  const modalPrograms = useMemo(() => {
    if (!formData.cohortId) return []
    const cohort = filters.cohorts.find(c => c.id.toString() === formData.cohortId.toString())
    return cohort?.programs || []
  }, [formData.cohortId, filters.cohorts])

  const modalVacations = useMemo(() => {
    if (!formData.programId) return []
    const program = filters.allPrograms.find(p => p.id.toString() === formData.programId.toString())
    // Filtrer les vacations par programme et éventuellement par cohorte
    return program?.vacations || []
  }, [formData.programId, filters.allPrograms])

  // Reset dependent fields when parent changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, programId: '', vacationId: '' }))
  }, [formData.cohortId])

  useEffect(() => {
    setFormData(prev => ({ ...prev, vacationId: '' }))
  }, [formData.programId])

  // ── Logique des Filtres Dynamiques (Tableau) ────────────────────────────────
  const availablePrograms = useMemo(() => {
    const cohort = formattedCohorts.find(c => c.name === filterCohort)
    const programs = cohort ? cohort.programNames : filters.allPrograms.map(p => p.name)
    return Array.from(new Set(programs))
  }, [filterCohort, formattedCohorts, filters.allPrograms])

  // Reset programme filter if not available in new cohort
  useMemo(() => {
    if (filterProgramme !== 'Tous' && !availablePrograms.includes(filterProgramme)) {
      setFilterProgramme('Tous')
    }
  }, [availablePrograms])
  
  // ── Logique Métier (Filtrage & Pagination) ──────────────────────────────────
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchSearch = 
        student.nom.toLowerCase().includes(search.toLowerCase()) || 
        student.prenom.toLowerCase().includes(search.toLowerCase()) || 
        student.email.toLowerCase().includes(search.toLowerCase())
      
      const matchCohort = filterCohort === 'Tous' || student.cohort === filterCohort
      const matchProgramme = filterProgramme === 'Tous' || student.programme === filterProgramme
      
      return matchSearch && matchCohort && matchProgramme
    })
  }, [students, search, filterCohort, filterProgramme])

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredStudents, currentPage])

  // Reset page relative to filters
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterProgramme(e.target.value)
    setCurrentPage(1)
  }

  // ── Actions CRUD ─────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: 'M',
      homeChurch: '',
      worker: false,
      ministry: '',
      address: '',
      phoneNumber: '',
      dateOfBirth: '',
      cohortId: '',
      programId: '',
      planningId: '',
      vacationId: '',
      status: 'pending'
    })
    setIsModalOpen(true)
  }

  const openEditModal = (student: StudentProp) => {
    setModalMode('edit')
    setCurrentStudent(student)
    setFormData({
      firstName: student.prenom,
      lastName: student.nom,
      email: student.email,
      password: '', // On ne touche pas au password en édition ici
      gender: 'M', // Info non présente dans StudentProp actuellement, à améliorer plus tard
      homeChurch: student.eglise,
      worker: student.estOuvrier,
      ministry: student.departement,
      address: '', 
      phoneNumber: student.telephone,
      dateOfBirth: '', 
      cohortId: '', // Nécessiterait l'ID réel
      programId: '', 
      planningId: '', 
      vacationId: student.vacation.toLowerCase(),
      status: student.statut === 'Confirmé' ? 'confirmed' : 'pending'
    })
    setIsModalOpen(true)
  }

  const handleDeletePrompt = (student: StudentProp) => {
    setCurrentStudent(student)
    setIsDeleteModalOpen(true)
  }

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault()
    setIsModalOpen(false)
  }

  const confirmDelete = () => {
    setIsDeleteModalOpen(false)
  }

  // ── Rendu de l'UI ────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Étudiants" description="Gérez les inscriptions et les profils des disciples.">
      <Head title="Étudiants — Admin ACADIS" />
      
      {/* 1. Actions Rapides (Recherche, Filtres, Ajout) */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom..."
            value={search}
            onChange={handleSearch}
            className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm transition-colors"
          />
        </div>
        
        <div className="w-full md:w-44 relative">
          <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterCohort}
            onChange={(e) => { setFilterCohort(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm font-medium text-gray-700 cursor-pointer appearance-none"
          >
            <option value="Tous">Toutes les cohortes</option>
            {formattedCohorts.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44 relative">
          <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterProgramme}
            onChange={handleFilter}
            className="block w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm font-medium text-gray-700 cursor-pointer appearance-none"
          >
            <option value="Tous">Tous les programmes</option>
            {availablePrograms.map(progName => (
              <option key={progName} value={progName}>{progName}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={openCreateModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5 ml-auto"
        >
          <Plus className="w-4 h-4" />
          Ajouter un étudiant
        </button>
      </div>

      {/* 3. Tableau Global (Card) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Étudiant</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Option (Session/Vacation)</th>
                <th className="px-6 py-4">Programme</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold text-sm flex-shrink-0 uppercase">
                          {student.prenom[0]}{student.nom[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 uppercase">{student.nom} <span className="capitalize">{student.prenom}</span></div>
                          <div className="text-xs text-gray-400 mt-0.5">{student.eglise} — {student.ministere}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 font-medium flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" /> {student.telephone}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1.5"><Mail className="w-3 h-3 text-gray-400" /> {student.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-700">
                          {student.session}
                        </span>
                        <span className="inline-flex w-fit items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-500">
                          {student.type === 'en ligne' ? <Globe className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                          {student.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex flex-col gap-1">
                        <div className="px-2.5 py-1 rounded-md bg-orange/10 text-orange text-xs font-bold border border-orange/20 whitespace-nowrap">
                          {student.programme}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase ml-1">{student.cohort}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        student.statut === 'confirmed' ? 'bg-green-100 text-green-700' :
                        student.statut === 'pending' ? 'bg-orange/20 text-orange' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          student.statut === 'confirmed' ? 'bg-green-500' :
                          student.statut === 'pending' ? 'bg-orange' :
                          'bg-red-500'
                        }`} />
                        {student.statut === 'confirmed' ? 'Confirmé' : student.statut === 'pending' ? 'En attente' : student.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(student)}
                          className="p-1.5 bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePrompt(student)}
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
                    Aucun étudiant ne correspond à votre recherche.
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
              Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredStudents.length)} sur {filteredStudents.length} étudiants
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
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                {modalMode === 'create' ? <Plus className="w-5 h-5 text-orange" /> : <Edit2 className="w-5 h-5 text-orange" />}
                {modalMode === 'create' ? 'Ajouter un étudiant' : 'Modifier le profil'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form id="studentRegistrationForm" onSubmit={handleSaveStudent} className="space-y-8">
                
                {/* 1. SECTION IDENTITÉ */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center font-bold text-xs">01</div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Identité du Compte</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Prénom</label>
                      <input 
                        type="text" required
                        placeholder="Ex: Jean"
                        value={formData.firstName} 
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Nom</label>
                      <input 
                        type="text" required
                        placeholder="Ex: Dupont"
                        value={formData.lastName} 
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Email</label>
                      <input 
                        type="email" required
                        placeholder="jean.dupont@exemple.com"
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    {modalMode === 'create' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Mot de passe temporaire</label>
                        <input 
                          type="password" required
                          placeholder="••••••••"
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. SECTION PROFIL DISCIPLE */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center font-bold text-xs">02</div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Profil du Disciple</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Genre</label>
                      <select 
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none appearance-none cursor-pointer"
                      >
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Téléphone</label>
                      <input 
                        type="tel" required
                        placeholder="+243..."
                        value={formData.phoneNumber} 
                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Date de naissance</label>
                      <input 
                        type="date" required
                        value={formData.dateOfBirth} 
                        onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Église d'attache</label>
                      <input 
                        type="text" required
                        placeholder="Nom de l'église"
                        value={formData.homeChurch} 
                        onChange={e => setFormData({...formData, homeChurch: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Adresse Physique</label>
                      <textarea 
                        rows={2}
                        placeholder="Adresse complète..."
                        value={formData.address} 
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="flex-1">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={formData.worker}
                            onChange={e => setFormData({...formData, worker: e.target.checked})}
                            className="w-5 h-5 text-orange bg-white border-gray-300 rounded-lg focus:ring-orange"
                          />
                          <span className="text-sm font-bold text-gray-900">Est un ouvrier ?</span>
                        </label>
                      </div>
                      {formData.worker && (
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Ministère / Département</label>
                          <select 
                            required={formData.worker}
                            value={formData.ministry} 
                            onChange={e => setFormData({...formData, ministry: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none cursor-pointer"
                          >
                            <option value="">Choisir un ministère</option>
                            {filters.departments.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. SECTION ACADÉMIQUE */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center font-bold text-xs">03</div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Inscription Académique</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Cohorte / Session</label>
                      <select 
                        required
                        value={formData.cohortId}
                        onChange={e => setFormData({...formData, cohortId: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none cursor-pointer"
                      >
                        <option value="">Sélectionner une cohorte</option>
                        {formattedCohorts.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Programme</label>
                      <select 
                        required
                        disabled={!formData.cohortId}
                        value={formData.programId}
                        onChange={e => setFormData({...formData, programId: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                      >
                        <option value="">Choisir un programme</option>
                        {modalPrograms.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Vacation</label>
                      <select 
                        required
                        disabled={!formData.programId}
                        value={formData.vacationId}
                        onChange={e => setFormData({...formData, vacationId: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                      >
                        <option value="">Choisir la vacation</option>
                        {modalVacations.map((v: any) => (
                          <option key={v.id} value={v.id}>{v.day} ({v.startTime} - {v.endTime})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Statut Inscription</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none cursor-pointer"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                      </select>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50 flex-shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-2xl transition-all">
                Annuler
              </button>
              <button type="submit" form="studentRegistrationForm" className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-0.5 active:scale-95">
                {modalMode === 'create' ? 'Inscrire l\'étudiant' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal Suppression */}
      {isDeleteModalOpen && currentStudent && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Supprimer l'étudiant ?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>{currentStudent.prenom} {currentStudent.nom}</strong> de la base de données ? Cette action est irréversible.
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
