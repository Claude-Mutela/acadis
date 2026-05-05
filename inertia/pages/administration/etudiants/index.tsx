import { useState, useMemo, useEffect } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import AdminLayout from '../../../components/administration/AdminLayout'
import { 
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, User, Mail, BookOpen, Clock, Phone, Home, Globe, Printer
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
  programmes: string[]
  programIds: string[]
  selectedPrograms: { id: string, vacationId: string }[]
  session: string
  type: string
  statut: string
  cohort: string
  cohortId: string
  planningId: string
  vacationId: string
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
  const { errors } = usePage<{ errors: Record<string, string> }>().props

  // ── Formatage des données (Logicielle de présentation) ──────────────────────
  const students = useMemo((): StudentProp[] => {
    return rawStudents.map((student: any) => {
      const profile = student.studentProfile
      const latestEnrollment = student.enrollments?.[0]
      const planning = latestEnrollment?.planning
      const cohort = planning?.cohorts?.[0]
      const programs = latestEnrollment?.programs || []
      const programNames = programs.map((p: any) => p.name)
      const programIds = programs.map((p: any) => p.id.toString())
      
      const selectedPrograms = programs.map((p: any) => ({
        id: p.id.toString(),
        vacationId: p.pivot_vacation_id?.toString() || '',
      }))

      const sessionDetails = programs.map((p: any) => {
        const vId = p.pivot_vacation_id
        // Trouver la vacation dans allPrograms (puisque non préchargée directement sur le pivot facilement)
        const allVacations = filters.allPrograms.flatMap(ap => ap.vacations || [])
        const v = allVacations.find(av => av.id === vId)
        return v ? (v.name || `${v.day} (${v.startTime})`) : '-'
      })

      return {
        id: student.id,
        nom: student.lastName,
        prenom: student.firstName,
        email: student.email,
        telephone: profile?.phoneNumber || '-',
        eglise: profile?.homeChurch || '-',
        ministere: profile?.ministry || '-',
        programme: programNames.length > 0 ? programNames.join(', ') : 'Non inscrit',
        programmes: programNames,
        programIds: programIds,
        selectedPrograms,
        session: Array.from(new Set(sessionDetails)).join(', '),
        type: planning?.type || '-',
        statut: latestEnrollment?.status || student.status || 'Aucun',
        cohort: cohort?.name || '-',
        cohortId: cohort?.id?.toString() || '',
        planningId: planning?.id?.toString() || '',
        vacationId: '', // n'est plus utilisé au niveau racine
        estOuvrier: profile?.worker === 'Oui',
        departement: profile?.ministry || '-',
        vacation: Array.from(new Set(sessionDetails)).join(', '),
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
  
  // États pour le rapport d'impression
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportCohort, setReportCohort] = useState('Tous')
  const [reportProgram, setReportProgram] = useState('Tous')
  const [reportWorker, setReportWorker] = useState('Tous')
  const [reportType, setReportType] = useState('Tous')
  const [reportStudents, setReportStudents] = useState<StudentProp[]>([])

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
    programs: [] as { id: string, vacationId: string }[],
    planningId: '',
    status: 'pending'
  })

  // ── Logique des Filtres Dynamiques (Modale) ──────────────────────────────
  const modalPrograms = useMemo(() => {
    if (!formData.cohortId) return []
    const cohort = filters.cohorts.find(c => c.id.toString() === formData.cohortId.toString())
    return cohort?.programs || []
  }, [formData.cohortId, filters.cohorts])

  const getProgramVacations = (programId: string) => {
    const program = filters.allPrograms.find(p => p.id.toString() === programId)
    const vacations = program?.vacations || []
    // Retourner uniquement les vacations avec des noms uniques
    const uniqueVacations: any[] = []
    const seenNames = new Set()
    for (const v of vacations) {
      if (v.name && !seenNames.has(v.name)) {
        seenNames.add(v.name)
        uniqueVacations.push(v)
      } else if (!v.name && !seenNames.has(`${v.day} (${v.startTime})`)) {
         // Fallback si pas de nom (pour les anciennes données)
         seenNames.add(`${v.day} (${v.startTime})`)
         uniqueVacations.push(v)
      }
    }
    return uniqueVacations
  }

  // Résolution du planningId depuis la cohorte (premier planning actif)
  const resolvedPlanningId = useMemo(() => {
    if (!formData.cohortId) return ''
    const cohort = filters.cohorts.find((c: any) => c.id.toString() === formData.cohortId.toString())
    // On prend le premier planning de la cohorte s'il existe
    const planning = cohort?.plannings?.[0]
    return planning ? planning.id.toString() : ''
  }, [formData.cohortId, filters.cohorts])

  // Synchroniser planningId dans formData quand la cohorte change
  useEffect(() => {
    if (resolvedPlanningId) {
      setFormData(prev => ({ ...prev, planningId: resolvedPlanningId }))
    }
  }, [resolvedPlanningId])

  useEffect(() => {
    setFormData(prev => ({ ...prev, programs: [] }))
  }, [formData.cohortId])

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
      const matchProgramme = filterProgramme === 'Tous' || student.programmes.includes(filterProgramme)
      
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
      programs: [],
      planningId: '',
      status: 'pending'
    })
    setIsModalOpen(true)
  }

  const openEditModal = (student: StudentProp) => {
    setModalMode('edit')
    setCurrentStudent(student)
    // On remplit formData avec ce qu'on a dans StudentProp
    // cohortId et planningId seront enrichis lors d'une prochaine itération
    setFormData(prev => ({
      ...prev,
      firstName: student.prenom,
      lastName: student.nom,
      email: student.email,
      password: '',
      gender: 'M',
      homeChurch: student.eglise,
      worker: student.estOuvrier,
      ministry: student.departement !== '-' ? student.departement : '',
      address: '',
      phoneNumber: student.telephone !== '-' ? student.telephone : '',
      dateOfBirth: '',
      cohortId: student.cohortId,
      programs: student.selectedPrograms,
      planningId: student.planningId,
      status: student.statut === 'confirmed' ? 'confirmed'
             : student.statut === 'rejected'  ? 'rejected'
             : student.statut === 'cancelled' ? 'cancelled'
             : 'pending'
    }))
    setIsModalOpen(true)
  }

  const handleDeletePrompt = (student: StudentProp) => {
    setCurrentStudent(student)
    setIsDeleteModalOpen(true)
  }

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      ...(modalMode === 'create' ? { password: formData.password } : {}),
      gender: formData.gender,
      homeChurch: formData.homeChurch,
      worker: formData.worker,
      ministry: formData.ministry || null,
      physiqueAddress: formData.address || null,
      phoneNumber: formData.phoneNumber || null,
      dateofbirth: formData.dateOfBirth || null,
      planningId: Number(formData.planningId) || undefined,
      programs: formData.programs.map(p => ({ id: Number(p.id), vacationId: Number(p.vacationId) })),
      status: formData.status,
    }

    if (modalMode === 'create') {
      router.post('/administration/etudiants', payload, {
        preserveScroll: true,
        onSuccess: () => setIsModalOpen(false),
      })
    } else if (currentStudent) {
      router.put(`/administration/etudiants/${currentStudent.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  const confirmDelete = () => {
    console.log('Confirm Delete called for:', currentStudent)
    if (!currentStudent) return
    router.delete(`/administration/etudiants/${currentStudent.id}`, {
      preserveScroll: true,
      onSuccess: () => setIsDeleteModalOpen(false),
    })
  }

  const handlePrintReport = () => {
    const filtered = students.filter(s => {
      const matchCohort = reportCohort === 'Tous' || s.cohort === reportCohort
      const matchProgram = reportProgram === 'Tous' || s.programme === reportProgram
      const matchWorker = reportWorker === 'Tous' || 
                         (reportWorker === 'Ouvriers' && s.estOuvrier) || 
                         (reportWorker === 'Non-Ouvriers' && !s.estOuvrier)
      const matchType = reportType === 'Tous' || s.type === reportType
      
      return matchCohort && matchProgram && matchWorker && matchType
    })

    setReportStudents(filtered)
    setIsReportModalOpen(false)
    
    setTimeout(() => {
      window.print()
      setReportStudents([])
    }, 500)
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

        <div className="flex items-center gap-2 ml-auto w-full md:w-auto">
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl text-sm border border-gray-200 shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Printer className="w-5 h-5 text-gray-400" />
            Imprimer
          </button>
          <button 
            onClick={openCreateModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* 3. Tableau Global (Card) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Étudiant</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Session/Vacation</th>
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
                          {(student.prenom?.[0] || '')}{(student.nom?.[0] || '')}
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
                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Nom</label>
                      <input 
                        type="text" required
                        placeholder="Ex: Dupont"
                        value={formData.lastName} 
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Email</label>
                      <input 
                        type="email" required
                        placeholder="jean.dupont@exemple.com"
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    {modalMode === 'create' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Mot de passe temporaire</label>
                        <input 
                          type="password" required
                          placeholder="••••••••"
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all ${errors.phoneNumber ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Date de naissance</label>
                      <input 
                        type="date"
                        value={formData.dateOfBirth} 
                        onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all ${errors.dateofbirth ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.dateofbirth && <p className="text-red-500 text-xs mt-1">{errors.dateofbirth}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Église d'attache</label>
                      <input 
                        type="text" required
                        placeholder="Nom de l'église"
                        value={formData.homeChurch} 
                        onChange={e => setFormData({...formData, homeChurch: e.target.value})}
                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all ${errors.homeChurch ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.homeChurch && <p className="text-red-500 text-xs mt-1">{errors.homeChurch}</p>}
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
                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none cursor-pointer ${errors.planningId ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      >
                        <option value="">Sélectionner une cohorte</option>
                        {formattedCohorts.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {errors.planningId && <p className="text-red-500 text-xs mt-1">{errors.planningId}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Programmes et Vacations</label>
                      <div className={`grid grid-cols-1 gap-4 p-4 bg-gray-50 border rounded-xl transition-all ${errors.programs ? 'border-red-400 bg-red-50' : 'border-gray-200'} ${!formData.cohortId ? 'opacity-30' : ''}`}>
                        {!formData.cohortId ? (
                          <p className="text-xs text-gray-400 italic">Sélectionnez d'abord une cohorte</p>
                        ) : modalPrograms.length > 0 ? (
                          modalPrograms.map((p: any) => {
                            const isSelected = formData.programs.some(sp => sp.id === p.id.toString())
                            return (
                              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <label className="flex items-center gap-3 cursor-pointer group flex-1">
                                  <input 
                                    type="checkbox"
                                    value={p.id}
                                    checked={isSelected}
                                    onChange={e => {
                                      const id = p.id.toString()
                                      if (e.target.checked) {
                                        setFormData({...formData, programs: [...formData.programs, { id, vacationId: '' }]})
                                      } else {
                                        setFormData({...formData, programs: formData.programs.filter(item => item.id !== id)})
                                      }
                                    }}
                                    className="w-4 h-4 text-orange bg-white border-gray-300 rounded focus:ring-orange"
                                  />
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">{p.name}</span>
                                </label>
                                
                                {isSelected && (
                                  <div className="flex-1">
                                    <select 
                                      required
                                      value={formData.programs.find(sp => sp.id === p.id.toString())?.vacationId || ''}
                                      onChange={e => {
                                        const newPrograms = formData.programs.map(sp => 
                                          sp.id === p.id.toString() ? { ...sp, vacationId: e.target.value } : sp
                                        )
                                        setFormData({...formData, programs: newPrograms})
                                      }}
                                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-orange focus:border-transparent outline-none cursor-pointer"
                                    >
                                      <option value="">Choisir la vacation</option>
                                      {getProgramVacations(p.id.toString()).map((v: any) => (
                                        <option key={v.id} value={v.id}>{v.name || `${v.day} (${v.startTime})`}</option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-xs text-gray-400 italic">Aucun programme lié à cette cohorte</p>
                        )}
                      </div>
                      {errors.programs && <p className="text-red-500 text-xs mt-1">{errors.programs}</p>}
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

      {/* Modal Impression Rapports */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReportModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange" />
                Imprimer un rapport
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Cohorte</label>
                  <select 
                    value={reportCohort}
                    onChange={(e) => setReportCohort(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  >
                    <option value="Tous">Toutes les cohortes</option>
                    {formattedCohorts.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Programme</label>
                  <select 
                    value={reportProgram}
                    onChange={(e) => setReportProgram(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                  >
                    <option value="Tous">Tous les programmes</option>
                    {filters.allPrograms.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Statut Ouvrier</label>
                    <select 
                      value={reportWorker}
                      onChange={(e) => setReportWorker(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                    >
                      <option value="Tous">Tout le monde</option>
                      <option value="Ouvriers">Ouvriers seulement</option>
                      <option value="Non-Ouvriers">Non-ouvriers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Type / Mode</label>
                    <select 
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                    >
                      <option value="Tous">Tous les modes</option>
                      <option value="en ligne">Online</option>
                      <option value="en présentiel">Onsite</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button onClick={() => setIsReportModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                  Annuler
                </button>
                <button 
                  onClick={handlePrintReport}
                  className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Générer le rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
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

      {/* Zone d'impression du rapport Étudiants */}
      {reportStudents.length > 0 && (
        <div id="printable-students-report" className="hidden print:block p-8 bg-white text-black font-sans">
          <style>
            {`
              @media print {
                @page { margin: 0; size: auto; }
                body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                body * { visibility: hidden; }
                #printable-students-report, #printable-students-report * { visibility: visible; }
                #printable-students-report { 
                  position: absolute; left: 0; top: 0; width: 100%; padding: 15mm; background: white;
                }
              }
            `}
          </style>
          <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
            <div className="flex items-center gap-4">
              <img src="/logo ACADIS.png" alt="Logo ACADIS" className="w-16 h-auto" />
              <div>
                <h1 className="text-2xl font-black text-black uppercase tracking-tighter">ACADIS</h1>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Liste des Étudiants / Disciples</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-black">LISTE DES ÉTUDIANTS</p>
              <p className="text-[10px] font-bold text-gray-600 uppercase">
                {reportCohort !== 'Tous' && `Cohorte: ${reportCohort} | `}
                {reportProgram !== 'Tous' && `Prog: ${reportProgram} | `}
                {reportType !== 'Tous' && `Mode: ${reportType}`}
              </p>
            </div>
          </div>

          <table className="w-full border-collapse border-2 border-black">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black">
                <th className="px-2 py-2 text-left text-[9px] font-black uppercase border-r border-black">#</th>
                <th className="px-2 py-2 text-left text-[9px] font-black uppercase border-r border-black">Nom & Prénom</th>
                <th className="px-2 py-2 text-left text-[9px] font-black uppercase border-r border-black">Contact</th>
                <th className="px-2 py-2 text-left text-[9px] font-black uppercase border-r border-black">Programme / Cohorte</th>
                <th className="px-2 py-2 text-left text-[9px] font-black uppercase border-r border-black">Type</th>
                <th className="px-2 py-2 text-center text-[9px] font-black uppercase">Ouvrier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {reportStudents.map((s, idx) => (
                <tr key={s.id} className="border-b border-gray-200">
                  <td className="px-2 py-1 text-[10px] border-r border-black text-center">{idx + 1}</td>
                  <td className="px-2 py-1 text-[10px] border-r border-black font-bold uppercase">{s.nom} {s.prenom}</td>
                  <td className="px-2 py-1 text-[9px] border-r border-black italic">{s.telephone} / {s.email}</td>
                  <td className="px-2 py-1 text-[9px] border-r border-black">{s.programme} ({s.cohort})</td>
                  <td className="px-2 py-1 text-[9px] border-r border-black uppercase text-center">{s.type}</td>
                  <td className="px-2 py-1 text-[10px] text-center font-black">{s.estOuvrier ? 'OUI' : 'NON'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center bg-gray-100 p-3 border-2 border-black">
            <p className="text-xs font-black uppercase">Total des étudiants listés :</p>
            <p className="text-xl font-black">{reportStudents.length}</p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-12">
            <div className="border-t border-black pt-2 text-center">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Le Secrétariat Académique</p>
            </div>
            <div className="border-t border-black pt-2 text-center">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Cachet & Visa Direction</p>
            </div>
          </div>

          <div className="mt-12 pt-4 text-center text-[8px] text-gray-400">
            <p>Document officiel ACADIS - Généré le {new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}
