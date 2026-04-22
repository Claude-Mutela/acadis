import { useState, useRef, useEffect } from 'react'
import { Head, usePage, useForm, router } from '@inertiajs/react'
import AdminLayout from '~/components/administration/AdminLayout'
import { 
  Search, Plus, Edit2, Trash2, X, FolderTree, BookOpen, Clock, 
  Target, Award, Image as ImageIcon, Camera, User as UserIcon, 
  AlertCircle, LayoutList, FileText, Layers, Hash, MoveHorizontal, ChevronRight, Save, UploadCloud, CalendarClock
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type User = { id: number, firstName: string, lastName: string, email: string }
type Trainer = { id: number, userId: number, user: User }
type Categorie = { id: number, name: string, description: string | null }
type Cohort = { id: number, name: string }
type BaseModule = { id: number, title: string, description: string, order: number, programId: number }
type BaseManuel = { id: number, title: string, description: string, price: number, coverImage: string | null, fileUrl: string, isPublished: boolean, programId: number }
type Vacation = { id: number, name: string, programId: number, cohortId: number, day: string, startTime: string, endTime: string }

type Programme = {
  id: number
  name: string
  slug: string
  categoryId: number | null
  trainerId: number
  description: string
  presentation: string
  duration: string
  status: 'active' | 'pending'
  objectives: string | string[]
  outputProfile: string | string[]
  coverImage: string | null
  category?: Categorie
  trainer?: Trainer
  cohorts?: Cohort[]
  modules?: BaseModule[]
  manuels?: BaseManuel[]
}

export default function ProgrammesIndex() {
  const { programs, categories, trainers, cohorts, vacations } = usePage<{ 
    programs: Programme[], 
    categories: Categorie[],
    trainers: Trainer[],
    cohorts: Cohort[],
    vacations: Vacation[]
  }>().props
  
  const [searchProg, setSearchProg] = useState('')
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false)
  const [isProgModalOpen, setIsProgModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'cat' | 'prog' | 'vacation' | 'module', id: number } | null>(null)

  // Modales spécifiques
  const [activeProgForModules, setActiveProgForModules] = useState<Programme | null>(null)
  const [activeProgForManuels, setActiveProgForManuels] = useState<Programme | null>(null)

  // ── Logic: Modules (useForm) ────────────────────────────────────────────────
  const [editingModule, setEditingModule] = useState<BaseModule | null>(null)
  const moduleForm = useForm({
    title: '',
    description: '',
    order: 1,
    programId: ''
  })

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeProgForModules?.id) return
    
    if (editingModule) {
      moduleForm.put(`/administration/programmes/modules/${editingModule.id}`, {
        onSuccess: () => { setEditingModule(null); moduleForm.reset(); }
      })
    } else {
      moduleForm.post('/administration/programmes/modules', {
        onSuccess: () => moduleForm.reset()
      })
    }
  }

  // État local pour le formulaire de manuel (Stub)
  const [manuelFormData, setManuelFormData] = useState({
    title: '',
    price: '',
    description: '',
    isPublished: false,
    coverFile: null as File | null,
    pdfFile: null as File | null
  })
  const [manuelCoverPreview, setManuelCoverPreview] = useState<string | null>(null)
  const manualCoverInputRef = useRef<HTMLInputElement>(null)
  const manualPdfInputRef = useRef<HTMLInputElement>(null)

  const handleManuelFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'cover') {
      setManuelFormData(prev => ({ ...prev, coverFile: file }))
      const reader = new FileReader()
      reader.onloadend = () => setManuelCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setManuelFormData(prev => ({ ...prev, pdfFile: file }))
    }
  }

  // ── Logic: Categories ──────────────────────────────────────────────────────
  const [editingCategory, setEditingCategory] = useState<Categorie | null>(null)
  const categoryForm = useForm({
    name: '',
    description: '',
  })

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      categoryForm.put(`/administration/programmes/categories/${editingCategory.id}`, {
        onSuccess: () => { setEditingCategory(null); categoryForm.reset(); }
      })
    } else {
      categoryForm.post('/administration/programmes/categories', {
        onSuccess: () => categoryForm.reset()
      })
    }
  }

  // ── Logic: Vacations (useForm) ────────────────────────────────────────────────
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null)
  const vacationForm = useForm({
    name: '',
    programId: '',
    cohortId: '',
    day: 'Lundi',
    startTime: '08:00',
    endTime: '10:00'
  })

  const handleSaveVacation = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingVacation) {
      vacationForm.put(`/administration/programmes/vacations/${editingVacation.id}`, {
        onSuccess: () => { setEditingVacation(null); vacationForm.reset(); }
      })
    } else {
      vacationForm.post('/administration/programmes/vacations', {
        onSuccess: () => vacationForm.reset()
      })
    }
  }

  // ── Logic: Programmes ──────────────────────────────────────────────────────
  const [progMode, setProgMode] = useState<'create' | 'edit'>('create')
  const [currentProgId, setCurrentProgId] = useState<number | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [autoSlug, setAutoSlug] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const programForm = useForm<{
    name: string
    slug: string
    categoryId: number | null
    trainerId: number | ''
    cohortId: number | ''
    description: string
    presentation: string
    duration: string
    status: 'active' | 'pending'
    outputProfile: string[]
    objectives: string[]
    coverImage: File | null
  }>({
    name: '',
    slug: '',
    categoryId: categories[0]?.id || null,
    trainerId: trainers[0]?.id || '',
    cohortId: cohorts[0]?.id || '',
    description: '',
    presentation: '',
    duration: '',
    status: 'pending',
    outputProfile: [''],
    objectives: [''],
    coverImage: null
  })

  useEffect(() => {
    if (autoSlug && progMode === 'create') {
      const gSlug = programForm.data.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
      programForm.setData('slug', gSlug)
    }
  }, [programForm.data.name])

  // S'assurer que les données des modales (modules/manuels) sont jour lors des mises à jour réseau (Inertia reload)
  useEffect(() => {
    if (activeProgForModules) {
      const refreshed = programs.find(p => p.id === activeProgForModules.id)
      if (refreshed) setActiveProgForModules(refreshed)
    }
    if (activeProgForManuels) {
      const refreshed = programs.find(p => p.id === activeProgForManuels.id)
      if (refreshed) setActiveProgForManuels(refreshed)
    }
  }, [programs])

  const parseJsonArray = (data: any): string[] => {
    if (Array.isArray(data)) return data
    try { return JSON.parse(data) } catch { return [''] }
  }

  const openProgModal = (prog?: Programme) => {
    setImagePreview(prog?.coverImage || null)
    programForm.clearErrors()
    setAutoSlug(prog ? false : true)
    if (prog) {
      setProgMode('edit')
      setCurrentProgId(prog.id)
      programForm.setData({
        name: prog.name,
        slug: prog.slug,
        categoryId: prog.categoryId,
        trainerId: prog.trainerId,
        cohortId: prog.cohorts?.[0]?.id || '',
        description: prog.description,
        presentation: prog.presentation,
        duration: prog.duration,
        status: prog.status,
        outputProfile: parseJsonArray(prog.outputProfile),
        objectives: parseJsonArray(prog.objectives),
        coverImage: null
      })
    } else {
      setProgMode('create')
      setCurrentProgId(null)
      programForm.reset()
      programForm.setData({
        ...programForm.data,
        categoryId: categories[0]?.id || null,
        trainerId: trainers[0]?.id || '',
        cohortId: cohorts[0]?.id || '',
        outputProfile: [''],
        objectives: ['']
      })
    }
    setIsProgModalOpen(true)
  }

  const handleSaveProg = (e: React.FormEvent) => {
    e.preventDefault()
    if (progMode === 'create') {
      programForm.post('/administration/programmes', {
        forceFormData: true,
        onSuccess: () => setIsProgModalOpen(false),
        onError: (errors) => console.error('Validation errors:', errors)
      })
    } else {
      // @ts-ignore
      programForm.post(`/administration/programmes/${currentProgId}?_method=PUT`, {
        onSuccess: () => setIsProgModalOpen(false),
        onError: (errors) => console.error('Validation errors:', errors),
        forceFormData: true
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      programForm.setData('coverImage', file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const updateArrayField = (field: 'outputProfile' | 'objectives', index: number, value: string) => {
    const newArr = [...programForm.data[field]]
    newArr[index] = value
    programForm.setData(field, newArr)
  }

  const addArrayItem = (field: 'outputProfile' | 'objectives') => {
    programForm.setData(field, [...programForm.data[field], ''])
  }

  const removeArrayItem = (field: 'outputProfile' | 'objectives', index: number) => {
    const newArr = [...programForm.data[field]]
    if (newArr.length > 1) {
      newArr.splice(index, 1)
      programForm.setData(field, newArr)
    }
  }

  const promptDeleteProp = (type: 'cat' | 'prog' | 'vacation' | 'module', id: number) => {
    setDeleteTarget({ type, id })
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const url = deleteTarget.type === 'cat' 
      ? `/administration/programmes/categories/${deleteTarget.id}` 
      : deleteTarget.type === 'prog' ? `/administration/programmes/${deleteTarget.id}` 
      : null
    
    if (url) {
      router.delete(url, { onSuccess: () => setIsDeleteModalOpen(false) })
    } else if (deleteTarget.type === 'vacation') {
      router.delete(`/administration/programmes/vacations/${deleteTarget.id}`, { onSuccess: () => setIsDeleteModalOpen(false) })
    } else if (deleteTarget.type === 'module') {
      router.delete(`/administration/programmes/modules/${deleteTarget.id}`, { onSuccess: () => setIsDeleteModalOpen(false) })
    }
  }

  const filteredProgrammes = (programs || []).filter(p => 
    p.name?.toLowerCase().includes(searchProg.toLowerCase()) || 
    (p.category?.name || '').toLowerCase().includes(searchProg.toLowerCase()) ||
    (p.trainer?.user?.lastName || '').toLowerCase().includes(searchProg.toLowerCase())
  )

  return (
    <AdminLayout title="Gestion du Catalogue">
      <Head title="Programmes Administration — ACADIS" />
      
      {/* 1. Header de Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Programmes</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Gérez les cursus de formation et leurs ressources pédagogiques.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCatModalOpen(true)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-sm border border-gray-200"
          >
            <FolderTree className="w-4 h-4" />
            Catégories
          </button>
          <button 
            onClick={() => setIsVacationModalOpen(true)}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-sm border border-blue-100"
          >
            <CalendarClock className="w-4 h-4" />
            Vacations
          </button>
          <button 
            onClick={() => openProgModal()}
            className="flex items-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Nouveau Programme
          </button>
        </div>
      </div>

      {/* 2. Barre de Recherche */}
      <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher un cours..."
            value={searchProg} onChange={e => setSearchProg(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* 3. Tableau des Programmes */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-[0.2em]">
                <th className="px-6 py-5">Visuel</th>
                <th className="px-6 py-5">Cursus Pédagogique</th>
                <th className="px-6 py-5">Cohorte / Cat.</th>
                <th className="px-6 py-5">Pédagogie</th>
                <th className="px-6 py-5 text-right">Pilotage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProgrammes.length > 0 ? filteredProgrammes.map(prog => (
                <tr key={prog.id} className="hover:bg-orange-50/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm relative group/img">
                      {prog.coverImage ? (
                        <img src={prog.coverImage} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-5 h-5" /></div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 group-hover:text-orange transition-colors">{prog.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                       {prog.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-gray-700">{prog.cohorts?.[0]?.name || 'Non assigné'}</span>
                      <span className="text-[10px] text-orange font-black uppercase tracking-widest">{prog.category?.name || 'GÉNÉRAL'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setActiveProgForModules(prog)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-orange-100 hover:text-orange text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
                        <Layers className="w-3.5 h-3.5" />
                        Modules
                      </button>
                      <button onClick={() => setActiveProgForManuels(prog)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
                        <FileText className="w-3.5 h-3.5" />
                        Manuels
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openProgModal(prog)} className="p-2 bg-white text-gray-400 hover:text-blue-600 rounded-xl shadow-sm border border-gray-100 transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => promptDeleteProp('prog', prog.id)} className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm border border-gray-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold italic">Aucun programme n'a été trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE : PROGRAMME (CRUD) */}
      {isProgModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsProgModalOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-orange" />
                {progMode === 'create' ? 'Ajout d\'un cursus' : 'Édition du programme'}
              </h3>
              <button onClick={() => setIsProgModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm transition-colors border border-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProg} className="overflow-y-auto flex-1 p-8 space-y-10">
              {/* Bandeau d'erreurs global */}
              {Object.keys(programForm.errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700">Le formulaire contient des erreurs :</p>
                    <ul className="mt-2 space-y-1">
                      {Object.entries(programForm.errors).map(([field, msg]) => (
                        <li key={field} className="text-xs text-red-600">• <strong>{field}</strong> : {msg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-11 gap-8">
                {/* Lateral: Image & Settings */}
                <div className="lg:col-span-3 space-y-6">
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`aspect-video rounded-3xl bg-gray-50 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-orange hover:bg-orange-50/50 transition-all group overflow-hidden relative ${programForm.errors.coverImage ? 'border-red-300' : 'border-gray-200'}`}
                   >
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto group-hover:text-orange transition-colors" />
                          <span className="text-[9px] font-black text-gray-400 mt-2 block uppercase tracking-tighter">Couverture</span>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                   </div>

                   <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Expert Assigné</label>
                        <select required value={programForm.data.trainerId} onChange={e => programForm.setData('trainerId', parseInt(e.target.value))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange focus:bg-white outline-none">
                          <option value="">Sélectionner</option>
                          {trainers.map(t => <option key={t.id} value={t.id}>{t.user.firstName} {t.user.lastName}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Cohorte de rattachement</label>
                        <select value={programForm.data.cohortId} onChange={e => programForm.setData('cohortId', parseInt(e.target.value))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange focus:bg-white outline-none">
                          <option value="">Choisir une cohorte</option>
                          {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Statut Publication</label>
                        <select value={programForm.data.status} onChange={e => programForm.setData('status', e.target.value as 'active' | 'pending')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-wider focus:ring-2 focus:ring-orange outline-none">
                          <option value="pending">Brouillon</option>
                          <option value="active">Publié</option>
                        </select>
                      </div>
                      
                   </div>
                </div>

                {/* Main: Detailed Data */}
                <div className="lg:col-span-8 space-y-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Intitulé de la formation</label>
                       <input type="text" required value={programForm.data.name} onChange={e => programForm.setData('name', e.target.value)} className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl text-base font-black focus:bg-white focus:ring-2 focus:ring-orange outline-none shadow-sm transition-all ${programForm.errors.name ? 'border-red-300 bg-red-50/30' : 'border-gray-100'}`} placeholder="Introduction au Leadership..." />
                       {programForm.errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{programForm.errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Volume Horaire</label>
                        <input type="text" placeholder="60 heures" value={programForm.data.duration} onChange={e => programForm.setData('duration', e.target.value)} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Catégorie</label>
                        <select value={programForm.data.categoryId || ''} onChange={e => programForm.setData('categoryId', e.target.value ? parseInt(e.target.value) : null)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange outline-none">
                          <option value="">Général</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Description courte</label>
                      <input type="text" value={programForm.data.description} onChange={e => programForm.setData('description', e.target.value)} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange outline-none" placeholder="Une accroche pour le catalogue..." />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Présentation Synthétique</label>
                      <textarea rows={3} value={programForm.data.presentation} onChange={e => programForm.setData('presentation', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-[1.5rem] text-sm font-medium focus:ring-2 focus:ring-orange outline-none resize-none leading-relaxed" placeholder="Détails du cursus..." />
                    </div>

                    {/* Objectifs pédagogiques */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-orange" />
                          Objectifs Pédagogiques
                        </label>
                        <button type="button" onClick={() => addArrayItem('objectives')} className="flex items-center gap-1.5 text-[9px] font-black text-orange bg-orange/10 hover:bg-orange/20 px-3 py-1.5 rounded-xl transition-all uppercase tracking-wider">
                          <Plus className="w-3 h-3" /> Ajouter
                        </button>
                      </div>
                      <div className="space-y-2">
                        {programForm.data.objectives.map((obj, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange/10 text-orange text-[9px] font-black flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                            <input
                              type="text"
                              value={obj}
                              onChange={e => updateArrayField('objectives', idx, e.target.value)}
                              placeholder={`Objectif ${idx + 1}...`}
                              className={`flex-1 px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange outline-none transition-all ${(programForm.errors as any)[`objectives.${idx}`] ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}
                            />
                            {programForm.data.objectives.length > 1 && (
                              <button type="button" onClick={() => removeArrayItem('objectives', idx)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Profil de sortie */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-orange" />
                          Profil de Sortie
                        </label>
                        <button type="button" onClick={() => addArrayItem('outputProfile')} className="flex items-center gap-1.5 text-[9px] font-black text-orange bg-orange/10 hover:bg-orange/20 px-3 py-1.5 rounded-xl transition-all uppercase tracking-wider">
                          <Plus className="w-3 h-3" /> Ajouter
                        </button>
                      </div>
                      <div className="space-y-2">
                        {programForm.data.outputProfile.map((profile, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange/10 text-orange text-[9px] font-black flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                            <input
                              type="text"
                              value={profile}
                              onChange={e => updateArrayField('outputProfile', idx, e.target.value)}
                              placeholder={`Compétence acquise ${idx + 1}...`}
                              className={`flex-1 px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange outline-none transition-all ${(programForm.errors as any)[`outputProfile.${idx}`] ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}
                            />
                            {programForm.data.outputProfile.length > 1 && (
                              <button type="button" onClick={() => removeArrayItem('outputProfile', idx)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
              </div>

              <div className="flex gap-4 pt-10">
                <button type="button" onClick={() => setIsProgModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-gray-200 transition-all italic">Abandonner</button>
                <button type="submit" disabled={programForm.processing} className="flex-[2] py-4 bg-black text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl hover:bg-orange transition-all disabled:opacity-50">
                  {programForm.processing ? 'SYNCHRONISATION...' : 'VALIDER LES DONNÉES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE : MODULES CRUD */}
      {activeProgForModules && (
        <div className="fixed inset-0 z-[65] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveProgForModules(null)} />
          <div className="relative bg-white h-full w-full max-w-xl shadow-2xl animate-fade-in-right flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <span className="text-[10px] font-black text-orange uppercase tracking-widest italic">{activeProgForModules.name}</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1 flex items-center gap-3">
                  <Layers className="w-6 h-6" />
                  GESTION MODULES
                </h3>
              </div>
              <button onClick={() => {setActiveProgForModules(null); setEditingModule(null); moduleForm.reset();}} className="p-2 hover:bg-white rounded-full transition-all shadow-sm"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-10">
              <div className="bg-orange-50/30 p-6 rounded-3xl border border-orange-100 shadow-inner">
                 <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.3em] font-sans">{editingModule ? 'Mettre à jour le module' : 'Nouveau module d\'enseignement'}</h4>
                 
                 {Object.keys(moduleForm.errors).length > 0 && (
                   <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                     <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                     <div className="text-xs font-bold text-red-700">
                       <p>Correctifs nécessaires :</p>
                       {Object.values(moduleForm.errors).map((err, idx) => <span key={idx} className="block italic text-[10px]">- {err}</span>)}
                     </div>
                   </div>
                 )}

                 <form 
                   onSubmit={(e) => {
                     // Ensure programId is injected right before submit if not set
                     if (activeProgForModules?.id) {
                       moduleForm.setData('programId', activeProgForModules.id.toString())
                     }
                     handleSaveModule(e)
                   }} 
                   className="space-y-4"
                 >
                    <div className="flex gap-4">
                      <div className="flex-[3]">
                        <label className="text-[9px] font-black text-gray-400 mb-1 ml-1 uppercase block tracking-wider">Titre du module</label>
                        <input type="text" required value={moduleForm.data.title} onChange={e => moduleForm.setData('title', e.target.value)} placeholder="Titre (ex: Les bases)" className="w-full px-5 py-3.5 bg-white border border-orange-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange outline-none transition-all shadow-sm" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-gray-400 mb-1 ml-1 uppercase block tracking-wider">Ordre</label>
                        <input type="number" required value={moduleForm.data.order} onChange={e => moduleForm.setData('order', parseInt(e.target.value))} min="1" className="w-full px-5 py-3.5 bg-white border border-orange-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange outline-none transition-all shadow-sm text-center" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 mb-1 ml-1 uppercase block tracking-wider">Description courte</label>
                      <textarea required value={moduleForm.data.description} onChange={e => moduleForm.setData('description', e.target.value)} placeholder="Description du contenu..." className="w-full px-5 py-3.5 bg-white border border-orange-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-orange outline-none resize-none h-24" />
                    </div>
                    
                    <div className="flex gap-4 pt-2">
                      {editingModule && (
                         <button type="button" onClick={() => { setEditingModule(null); moduleForm.reset(); }} className="flex-1 py-4 bg-white border border-orange-200 text-orange-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic">Annuler</button>
                      )}
                      <button type="submit" disabled={moduleForm.processing} className="flex-[2] py-4 bg-orange text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all disabled:opacity-50">
                        {editingModule ? 'Enregistrer' : 'Ajouter au programme'}
                      </button>
                    </div>
                 </form>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between ml-2">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modules enregistrés</h4>
                   <span className="bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black text-gray-400">Total: {activeProgForModules.modules?.length || 0}</span>
                </div>
                <div className="space-y-4">
                   {(activeProgForModules.modules || []).length > 0 ? activeProgForModules.modules?.sort((a,b) => a.order - b.order).map((mod) => (
                     <div key={mod.id} className="group p-5 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl hover:shadow-gray-200/50 transition-all flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-orange group-hover:text-white rounded-2xl flex items-center justify-center font-black italic transition-all">{mod.order}</div>
                        <div className="flex-1">
                           <div className="font-bold text-gray-900 group-hover:text-orange transition-colors">{mod.title}</div>
                           <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">{mod.description}</div>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-all">
                           <button onClick={() => {
                              setEditingModule(mod);
                              moduleForm.setData({
                                title: mod.title,
                                description: mod.description,
                                order: mod.order,
                                programId: mod.programId.toString()
                              });
                           }} className="p-2 text-gray-300 hover:text-blue-500 transition-all"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => promptDeleteProp('module', mod.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                     </div>
                   )) : (
                     <div className="py-12 text-center text-gray-300 text-[10px] font-black uppercase tracking-widest italic border-2 border-dashed border-gray-50 rounded-[2.5rem]">Aucun module pour le moment</div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE : MANUELS CRUD */}
      {activeProgForManuels && (
        <div className="fixed inset-0 z-[65] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveProgForManuels(null)} />
          <div className="relative bg-white h-full w-full max-w-xl shadow-2xl animate-fade-in-right flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">{activeProgForManuels.name}</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1 flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  BIBLIOTHÈQUE / MANUELS
                </h3>
              </div>
              <button onClick={() => { setActiveProgForManuels(null); setManuelCoverPreview(null); }} className="p-2 hover:bg-white rounded-full transition-all shadow-sm"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-10">
              <div className="bg-blue-50/30 p-8 rounded-[2.5rem] border border-blue-100/50 shadow-inner">
                 <h4 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.3em] font-sans">Nouveau document technique</h4>
                 <div className="space-y-5">
                    
                    {/* Preview Section */}
                    {manuelCoverPreview && (
                      <div className="relative w-24 h-32 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-blue-400 animate-in fade-in zoom-in duration-300">
                        <img src={manuelCoverPreview} className="w-full h-full object-cover" alt="" />
                        <button onClick={() => setManuelCoverPreview(null)} className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5"><X className="w-3 h-3 text-red-500" /></button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[9px] font-black text-gray-400 mb-1 block">Titre de l'ouvrage</label>
                        <input type="text" value={manuelFormData.title} onChange={e => setManuelFormData({...manuelFormData, title: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-blue-100 rounded-2xl text-[11px] font-bold outline-none" placeholder="..." />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-gray-400 mb-1 block">Prix ($)</label>
                        <input type="number" value={manuelFormData.price} onChange={e => setManuelFormData({...manuelFormData, price: e.target.value})} placeholder="0" className="w-full px-5 py-3 bg-white border border-blue-100 rounded-2xl text-[11px] font-bold outline-none" />
                      </div>
                      <div className="flex items-end pb-1">
                         <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={manuelFormData.isPublished} onChange={e => setManuelFormData({...manuelFormData, isPublished: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-0 border-blue-200" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Publier</span>
                         </label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                       <input type="file" ref={manualCoverInputRef} className="hidden" accept="image/*" onChange={e => handleManuelFileChange(e, 'cover')} />
                       <input type="file" ref={manualPdfInputRef} className="hidden" accept="application/pdf" onChange={e => handleManuelFileChange(e, 'pdf')} />
                       
                       <button onClick={() => manualCoverInputRef.current?.click()} className={`flex-1 py-3 px-4 rounded-2xl text-[9px] font-black transition-all flex items-center justify-center gap-2 border ${manuelFormData.coverFile ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-blue-100 text-gray-400 hover:bg-blue-50'}`}>
                          {manuelFormData.coverFile ? <Save className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />} 
                          {manuelFormData.coverFile ? 'COUVERTURE OK' : 'COUVERTURE (IMG)'}
                       </button>

                       <button onClick={() => manualPdfInputRef.current?.click()} className={`flex-1 py-3 px-4 rounded-2xl text-[9px] font-black transition-all flex items-center justify-center gap-2 border ${manuelFormData.pdfFile ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-blue-100 text-gray-400 hover:bg-blue-50'}`}>
                          <UploadCloud className="w-3.5 h-3.5" /> 
                          {manuelFormData.pdfFile ? 'PDF CHARGÉ' : 'FICHIER PDF'}
                       </button>
                    </div>
                    
                    <button className="w-full py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Ajouter à la bibliothèque</button>
                 </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Manuels disponibles</h4>
                <div className="space-y-4">
                   {(activeProgForManuels.manuels || []).length > 0 ? activeProgForManuels.manuels?.map((man) => (
                     <div key={man.id} className="group p-4 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 transition-all flex items-center gap-5">
                        <div className="w-14 h-20 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                           {man.coverImage ? <img src={man.coverImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><BookOpen className="w-6 h-6" /></div>}
                        </div>
                        <div className="flex-1">
                           <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{man.title}</div>
                           <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] font-black text-orange">{man.price} $</span>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${man.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{man.isPublished ? 'PUBLIÉ' : 'BROUILLON'}</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button className="p-2 text-gray-300 hover:text-blue-600 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                           <button className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                   )) : (
                     <div className="py-12 text-center text-gray-300 text-[10px] font-black uppercase tracking-widest italic border-2 border-dashed border-gray-50 rounded-[2.5rem]">Aucun manuel indexé</div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE : CATEGORIES */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <FolderTree className="w-6 h-6 text-orange" />
                DÉFINITION DES CATÉGORIES
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm transition-colors border border-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-8 space-y-10">
              <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
                <h4 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.3em] font-sans">{editingCategory ? 'Modification catégorie' : 'Nouvelle catégorie'}</h4>
                <form onSubmit={handleSaveCat} className="space-y-4">
                   <div className="grid grid-cols-1 gap-4">
                      {Object.keys(categoryForm.errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                           <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                           <p className="text-xs font-bold text-red-700">Le formulaire contient des erreurs à corriger.</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Intitulé</label>
                        <input type="text" required placeholder="Ex: Informatique, Management..." value={categoryForm.data.name} onChange={e => categoryForm.setData('name', e.target.value)} className={`w-full px-5 py-3.5 bg-white border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange outline-none shadow-sm transition-all ${categoryForm.errors.name ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} />
                        {categoryForm.errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{categoryForm.errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Description</label>
                        <input type="text" required placeholder="Description (obligatoire)" value={categoryForm.data.description} onChange={e => categoryForm.setData('description', e.target.value)} className={`w-full px-5 py-3.5 bg-white border rounded-2xl text-xs font-medium focus:ring-2 focus:ring-orange outline-none shadow-sm transition-all italic ${categoryForm.errors.description ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} />
                        {categoryForm.errors.description && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{categoryForm.errors.description}</p>}
                      </div>
                   </div>
                   <div className="flex gap-4 pt-2">
                    {editingCategory && (
                      <button type="button" onClick={() => {setEditingCategory(null); categoryForm.reset();}} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-gray-200 transition-all italic">
                        Annuler
                      </button>
                    )}
                    <button type="submit" disabled={categoryForm.processing} className="flex-[2] py-4 bg-black text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl hover:bg-orange transition-all disabled:opacity-50">
                      {categoryForm.processing ? 'SYNCHRONISATION...' : (editingCategory ? 'METTRE À JOUR' : 'Valider la catégorie')}
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between ml-2">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Index des rubriques</h4>
                   <span className="bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black text-gray-400">Total: {categories.length}</span>
                </div>
                <div className="space-y-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="group p-5 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl hover:shadow-gray-200/50 transition-all flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-orange group-hover:text-white rounded-2xl flex items-center justify-center transition-all">
                           <FolderTree className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-black text-gray-900 group-hover:text-orange transition-colors">{cat.name}</div>
                          <div className="text-[10px] text-gray-400 mt-1 italic font-medium">{cat.description || '— Aucun détail —'}</div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => {setEditingCategory(cat); categoryForm.setData({name: cat.name, description: cat.description || ''})}} className="p-2 bg-white text-gray-400 hover:text-blue-600 rounded-xl shadow-sm border border-gray-100 transition-all"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => promptDeleteProp('cat', cat.id)} className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm border border-gray-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE : VACATIONS */}
      {isVacationModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsVacationModalOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-orange/20">
                   <img src="/logo ACADIS.png" alt="Logo ACADIS" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                PLANIFICATION VACATIONS
              </h3>
              <button onClick={() => setIsVacationModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm transition-colors border border-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-8 space-y-10">
              <div className="bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100/50 shadow-inner">
                 <h4 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.3em] font-sans">Programmer une séance</h4>
                  <form onSubmit={handleSaveVacation} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       {Object.keys(vacationForm.errors).length > 0 && (
                        <div className="col-span-2 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                           <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                           <p className="text-xs font-bold text-red-700">Certains champs de la vacation sont invalides :
                             {Object.entries(vacationForm.errors).map(([f, m]) => <span className="block italic text-[10px] mt-0.5" key={f}>- {m}</span>)}
                           </p>
                        </div>
                       )}
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Cohorte</label>
                          <select required value={vacationForm.data.cohortId} onChange={e => {vacationForm.setData('cohortId', e.target.value); vacationForm.setData('programId', '')}} className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${vacationForm.errors.cohortId ? 'border-red-300 bg-red-50/50' : 'border-blue-100'}`}>
                            <option value="">Sélectionner</option>
                            {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                       </div>
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Programme</label>
                          <select required value={vacationForm.data.programId} onChange={e => vacationForm.setData('programId', e.target.value)} className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 ${vacationForm.errors.programId ? 'border-red-300 bg-red-50/50' : 'border-blue-100'}`} disabled={!vacationForm.data.cohortId}>
                            <option value="">Sélectionner</option>
                            {programs.filter(p => !vacationForm.data.cohortId || p.cohorts?.some(c => c.id.toString() === vacationForm.data.cohortId.toString())).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                       </div>
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Jour</label>
                          <select value={vacationForm.data.day} onChange={e => vacationForm.setData('day', e.target.value)} className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${vacationForm.errors.day ? 'border-red-300 bg-red-50/50' : 'border-blue-100'}`}>
                            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                       </div>
                       <div className="col-span-2 sm:col-span-1 flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Début</label>
                            <input type="time" required value={vacationForm.data.startTime} onChange={e => vacationForm.setData('startTime', e.target.value)} className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${vacationForm.errors.startTime ? 'border-red-300 bg-red-50/50' : 'border-blue-100'}`} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest ml-1">Fin</label>
                            <input type="time" required value={vacationForm.data.endTime} onChange={e => vacationForm.setData('endTime', e.target.value)} className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${vacationForm.errors.endTime ? 'border-red-300 bg-red-50/50' : 'border-blue-100'}`} />
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      {editingVacation && (
                        <button type="button" onClick={() => {setEditingVacation(null); vacationForm.reset();}} className="flex-1 py-4 bg-white border border-blue-200 text-blue-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic">
                          Annuler
                        </button>
                      )}
                      <button type="submit" disabled={vacationForm.processing} className="flex-[2] py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                        {editingVacation ? 'METTRE À JOUR' : 'Valider la vacation'}
                      </button>
                    </div>
                  </form>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between ml-2">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Séances programmées</h4>
                   <span className="bg-blue-50 px-3 py-1 rounded-full text-[9px] font-black text-blue-600">Total: {vacations.length}</span>
                </div>
                <div className="space-y-4">
                  {vacations.map(vac => {
                    const prog = programs.find(p => p.id === vac.programId)
                    const coh = cohorts.find(c => c.id === vac.cohortId)
                    return (
                      <div key={vac.id} className="group p-5 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-200 transition-all flex items-center gap-5 shadow-sm hover:shadow-xl hover:shadow-blue-50">
                          <div className="w-14 h-16 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white px-2">
                             <span className="text-[9px] font-black uppercase tracking-tighter leading-none mb-1">{vac.day.slice(0, 3)}</span>
                             <span className="text-xs font-black">{vac.startTime}</span>
                             <span className="text-[9px] font-bold opacity-75">{vac.endTime}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{coh?.name || 'Cohorte inconnue'}</div>
                            <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase mt-1">{vac.name}</div>
                            <div className="text-[11px] text-gray-400 font-medium mt-0.5">{prog?.name || 'Programme inconnu'}</div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => {
                              setEditingVacation(vac);
                              vacationForm.setData({
                                name: vac.name,
                                programId: vac.programId.toString(),
                                cohortId: vac.cohortId.toString(),
                                day: vac.day,
                                startTime: vac.startTime,
                                endTime: vac.endTime
                              });
                            }} className="p-2 bg-white text-gray-400 hover:text-blue-600 rounded-xl shadow-sm border border-gray-100 transition-all"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => promptDeleteProp('vacation', vac.id)} className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm border border-gray-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE : SUPPRESSION */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-[3rem] p-12 text-center max-w-sm w-full shadow-2xl animate-fade-in-up">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="font-black text-2xl text-gray-900 mb-3 italic tracking-tighter">SUPPRIMER ?</h3>
            <p className="text-[10px] text-gray-400 mb-10 font-bold uppercase tracking-[0.2em] leading-loose">Cette opération est irréversible et affectera définitivement les données liées.</p>
            <div className="flex flex-col gap-4">
              <button onClick={confirmDelete} className="w-full py-5 bg-red-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-red-200 hover:bg-red-700 transition-all">Oui, Supprimer</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-5 bg-gray-50 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-[1.5rem] hover:bg-gray-100 transition-all italic">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
