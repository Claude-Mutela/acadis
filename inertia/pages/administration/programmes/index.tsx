import { useState, useRef, useEffect } from 'react'
import { Head, usePage, useForm, router } from '@inertiajs/react'
import AdminLayout from '~/components/administration/AdminLayout'
import { 
  Search, Plus, Edit2, Trash2, X, FolderTree, BookOpen, Clock, 
  Target, Award, Image as ImageIcon, Camera, User as UserIcon, AlertCircle
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type User = { id: number, firstName: string, lastName: string, email: string }
type Trainer = { id: number, userId: number, user: User }
type Categorie = { id: number, name: string, description: string | null }
type Programme = {
  id: number
  name: string
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
}

export default function ProgrammesIndex() {
  const { programs, categories, trainers } = usePage<{ 
    programs: Programme[], 
    categories: Categorie[],
    trainers: Trainer[]
  }>().props
  
  const [searchProg, setSearchProg] = useState('')
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [isProgModalOpen, setIsProgModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'cat' | 'prog', id: number } | null>(null)

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

  // ── Logic: Programmes ──────────────────────────────────────────────────────
  const [progMode, setProgMode] = useState<'create' | 'edit'>('create')
  const [currentProgId, setCurrentProgId] = useState<number | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const programForm = useForm<{
    name: string
    categoryId: number | null
    trainerId: number | ''
    description: string
    presentation: string
    duration: string
    status: 'active' | 'pending'
    outputProfile: string[]
    objectives: string[]
    coverImage: File | null
  }>({
    name: '',
    categoryId: categories[0]?.id || null,
    trainerId: trainers[0]?.id || '',
    description: '',
    presentation: '',
    duration: '',
    status: 'pending',
    outputProfile: [''],
    objectives: [''],
    coverImage: null
  })

  // Synchronisation forcée si trainers change
  useEffect(() => {
    if (progMode === 'create' && !programForm.data.trainerId && trainers.length > 0) {
      programForm.setData('trainerId', trainers[0].id)
    }
  }, [trainers])

  const parseJsonArray = (data: any): string[] => {
    if (Array.isArray(data)) return data
    try { return JSON.parse(data) } catch { return [''] }
  }

  const openProgModal = (prog?: Programme) => {
    setImagePreview(prog?.coverImage || null)
    programForm.clearErrors()
    if (prog) {
      setProgMode('edit')
      setCurrentProgId(prog.id)
      programForm.setData({
        name: prog.name,
        categoryId: prog.categoryId,
        trainerId: prog.trainerId,
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
        outputProfile: [''],
        objectives: ['']
      })
    }
    setIsProgModalOpen(true)
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

  const handleSaveProg = (e: React.FormEvent) => {
    e.preventDefault()
    if (progMode === 'create') {
      programForm.post('/administration/programmes', {
        onSuccess: () => setIsProgModalOpen(false)
      })
    } else {
      // @ts-ignore
      programForm.post(`/administration/programmes/${currentProgId}?_method=PUT`, {
        onSuccess: () => setIsProgModalOpen(false),
        forceFormData: true
      })
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

  const promptDeleteProp = (type: 'cat' | 'prog', id: number) => {
    setDeleteTarget({ type, id })
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const url = deleteTarget.type === 'cat' 
      ? `/administration/programmes/categories/${deleteTarget.id}` 
      : `/administration/programmes/${deleteTarget.id}`
    router.delete(url, { onSuccess: () => setIsDeleteModalOpen(false) })
  }

  const filteredProgrammes = (programs || []).filter(p => 
    p.name?.toLowerCase().includes(searchProg.toLowerCase()) || 
    (p.category?.name || '').toLowerCase().includes(searchProg.toLowerCase()) ||
    (p.trainer?.user?.lastName || '').toLowerCase().includes(searchProg.toLowerCase())
  )

  return (
    <AdminLayout title="Gestion du Catalogue">
      <Head title="Programmes - Admin" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Programmes</h1>
          <p className="text-gray-500 mt-1 font-medium">Conception et supervision ingénierie.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCatModalOpen(true)}
            className="flex items-center gap-2 bg-gray-100/80 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-2xl text-sm transition-all shadow-sm border border-gray-200/50"
          >
            <FolderTree className="w-4 h-4" />
            Catégories
          </button>
          <button 
            onClick={() => openProgModal()}
            className="flex items-center gap-2 bg-brand-black hover:bg-brand-orange text-white font-bold py-2.5 px-6 rounded-2xl text-sm shadow-xl shadow-brand-black/10 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Nouveau Catalogue
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Filtrer par nom, catégorie, formateur..."
            value={searchProg} onChange={e => setSearchProg(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-black/5 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-[0.2em]">
                <th className="px-8 py-6">Aperçu</th>
                <th className="px-8 py-6">Programme / Expert</th>
                <th className="px-8 py-6">Catégorie</th>
                <th className="px-8 py-6">Statut</th>
                <th className="px-8 py-6 text-right">Gestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProgrammes.length > 0 ? filteredProgrammes.map(prog => (
                <tr key={prog.id} className="hover:bg-orange-50/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-20 h-12 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm transition-transform group-hover:scale-105">
                      {prog.coverImage ? (
                        <img src={prog.coverImage} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-5 h-5" /></div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-black text-gray-900 group-hover:text-brand-orange transition-colors">{prog.name}</div>
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2 font-bold uppercase tracking-wider">
                      <UserIcon className="w-3 h-3" />
                      {prog.trainer?.user ? `${prog.trainer.user.firstName} ${prog.trainer.user.lastName}` : 'Expert non assigné'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex px-3 py-1 rounded-full bg-orange-50 text-brand-orange text-[10px] font-black uppercase tracking-widest border border-orange-100">
                      {prog.category?.name || 'Général'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center w-fit gap-2 border ${prog.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${prog.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {prog.status === 'active' ? 'Actif' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openProgModal(prog)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => promptDeleteProp('prog', prog.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-gray-400 font-black uppercase tracking-widest italic text-xs">Aucun élément dans le catalogue</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE : PROGRAMME */}
      {isProgModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-md" onClick={() => setIsProgModalOpen(false)} />
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic">
                  <BookOpen className="w-7 h-7 text-brand-orange" />
                  {progMode === 'create' ? 'NOUVELLE FICHE PROGRAMME' : 'MODIFICATION PROGRAMME'}
                </h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-2">Expertise et Ingénierie de Formation</p>
              </div>
              <button onClick={() => setIsProgModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white p-3 rounded-full shadow-sm hover:shadow-xl transition-all"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSaveProg} className="overflow-y-auto flex-1 p-10 space-y-12">
              
              {/* Message d'erreur global */}
              {Object.keys(programForm.errors).length > 0 && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                   <AlertCircle className="w-5 h-5" />
                   Veuillez corriger les erreurs ci-dessous pour continuer.
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Image & Main Info */}
                <div className="lg:col-span-4 space-y-8">
                   <div>
                     <div 
                       onClick={() => fileInputRef.current?.click()}
                       className={`aspect-[4/3] rounded-[2.5rem] bg-gray-50 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-brand-orange hover:bg-orange-50/30 transition-all group overflow-hidden relative shadow-inner ${programForm.errors.coverImage ? 'border-red-300' : 'border-gray-200'}`}
                     >
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="w-10 h-10 text-white" /></div>
                          </>
                        ) : (
                          <>
                            <Camera className="w-10 h-10 text-gray-200 group-hover:text-brand-orange transition-colors" />
                            <span className="text-[10px] font-black text-gray-300 mt-3 uppercase tracking-widest">Couverture</span>
                          </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                     </div>
                     {programForm.errors.coverImage && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase">{programForm.errors.coverImage}</p>}
                   </div>

                   <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Responsable Pedagogique</label>
                        <select required value={programForm.data.trainerId} onChange={e => programForm.setData('trainerId', parseInt(e.target.value))} className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange outline-none shadow-inner ${programForm.errors.trainerId ? 'ring-2 ring-red-300' : ''}`}>
                          <option value="">Sélectionner un expert</option>
                          {trainers.map(t => (
                            <option key={t.id} value={t.id}>{t.user.firstName} {t.user.lastName}</option>
                          ))}
                        </select>
                        {programForm.errors.trainerId && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 uppercase">{programForm.errors.trainerId}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Statut Edition</label>
                        <select value={programForm.data.status} onChange={e => programForm.setData('status', e.target.value as 'active' | 'pending')} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange outline-none shadow-inner uppercase tracking-wider">
                          <option value="pending">Brouillon / Attente</option>
                          <option value="active">Actif / Publié</option>
                        </select>
                      </div>
                   </div>
                </div>

                {/* Technical Specs */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Intitulé Officiel</label>
                        <input type="text" required value={programForm.data.name} onChange={e => programForm.setData('name', e.target.value)} className={`w-full px-6 py-4 bg-gray-50 border-none focus:bg-white rounded-2xl text-base font-black italic focus:ring-2 focus:ring-brand-orange outline-none transition-all shadow-inner ${programForm.errors.name ? 'ring-2 ring-red-300' : ''}`} placeholder="Nom du cursus de formation..." />
                        {programForm.errors.name && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 uppercase">{programForm.errors.name}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Catégorie</label>
                          <select value={programForm.data.categoryId || ''} onChange={e => programForm.setData('categoryId', e.target.value ? parseInt(e.target.value) : null)} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange outline-none shadow-inner">
                            <option value="">Général / Sans catégorie</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          {programForm.errors.categoryId && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 uppercase">{programForm.errors.categoryId}</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Volume Horaire / Durée</label>
                          <input type="text" value={programForm.data.duration} onChange={e => programForm.setData('duration', e.target.value)} className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange outline-none shadow-inner ${programForm.errors.duration ? 'ring-2 ring-red-300' : ''}`} placeholder="Ex: 120h / 1 an" />
                          {programForm.errors.duration && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 uppercase">{programForm.errors.duration}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Slogan / Accroche</label>
                        <input type="text" value={programForm.data.description} onChange={e => programForm.setData('description', e.target.value)} className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange outline-none shadow-inner ${programForm.errors.description ? 'ring-2 ring-red-300' : ''}`} />
                        {programForm.errors.description && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 uppercase">{programForm.errors.description}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">Présentation Synthétique</label>
                        <textarea rows={4} value={programForm.data.presentation} onChange={e => programForm.setData('presentation', e.target.value)} className={`w-full px-6 py-5 bg-gray-50 border-none rounded-[2rem] text-sm font-medium leading-relaxed focus:ring-2 focus:ring-brand-orange outline-none resize-none shadow-inner ${programForm.errors.presentation ? 'ring-2 ring-red-300' : ''}`} placeholder="Décrivez le contenu pédagogique..." />
                        {programForm.errors.presentation && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 uppercase">{programForm.errors.presentation}</p>}
                      </div>
                    </div>
                </div>
              </div>

              {/* Dynamic Lists */}
              <div className="p-10 bg-gray-50/50 rounded-[3.5rem] border border-gray-100 shadow-inner">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <label className="text-[11px] font-black uppercase text-brand-orange tracking-[0.4em] flex items-center gap-3 italic"><Target className="w-5 h-5" /> Objectifs de formation</label>
                        <button type="button" onClick={() => addArrayItem('objectives')} className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg shadow-orange-200 hover:scale-110 active:scale-95 transition-all"><Plus className="w-5 h-5" /></button>
                      </div>
                      <div className="space-y-4">
                        {programForm.data.objectives.map((obj, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex gap-4 group">
                              <input type="text" value={obj} onChange={e => updateArrayField('objectives', i, e.target.value)} className="flex-1 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-orange outline-none transition-all" placeholder="Point clé de l'apprentissage..." />
                              <button type="button" onClick={() => removeArrayItem('objectives', i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 font-bold text-xl">×</button>
                            </div>
                            {programForm.errors[`objectives.${i}` as any] && <p className="text-[9px] text-red-500 font-bold ml-4 uppercase">{programForm.errors[`objectives.${i}` as any]}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <label className="text-[11px] font-black uppercase text-blue-600 tracking-[0.4em] flex items-center gap-3 italic"><Award className="w-5 h-5" /> Profil de sortie / Débouchés</label>
                        <button type="button" onClick={() => addArrayItem('outputProfile')} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-110 active:scale-95 transition-all"><Plus className="w-5 h-5" /></button>
                      </div>
                      <div className="space-y-4">
                        {programForm.data.outputProfile.map((prof, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex gap-4 group">
                              <input type="text" value={prof} onChange={e => updateArrayField('outputProfile', i, e.target.value)} className="flex-1 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Compétence acquise..." />
                              <button type="button" onClick={() => removeArrayItem('outputProfile', i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 font-bold text-xl">×</button>
                            </div>
                            {programForm.errors[`outputProfile.${i}` as any] && <p className="text-[9px] text-red-500 font-bold ml-4 uppercase">{programForm.errors[`outputProfile.${i}` as any]}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>

              <div className="pt-10 flex gap-6">
                <button type="button" onClick={() => setIsProgModalOpen(false)} className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">Abandonner</button>
                <button type="submit" disabled={programForm.processing} className="flex-2 py-5 bg-brand-black text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-brand-orange hover:shadow-orange/30 transition-all disabled:opacity-50">
                  {programForm.processing ? 'SYNCHRONISATION EN COURS...' : 'CONFIRMER L\'ENREGISTREMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE : CATEGORIES */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-md" onClick={() => setIsCatModalOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up transition-all">
            <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 italic"><FolderTree className="w-7 h-7 text-brand-orange" /> GÉRER LES CATÉGORIES</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white p-2 rounded-full shadow-sm"><X className="w-6 h-6" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-10 space-y-12">
              <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-inner">
                <h4 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.3em] font-sans">{editingCategory ? 'MODIFICATION' : 'NOUVELLE UNITÉ'}</h4>
                <form onSubmit={handleSaveCat} className="space-y-5">
                  <input type="text" required placeholder="Nom de la catégorie" value={categoryForm.data.name} onChange={e => categoryForm.setData('name', e.target.value)} className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange outline-none shadow-sm transition-all" />
                  {categoryForm.errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 uppercase">{categoryForm.errors.name}</p>}
                  
                  <input type="text" placeholder="Description courte (optionnelle)" value={categoryForm.data.description} onChange={e => categoryForm.setData('description', e.target.value)} className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-orange outline-none shadow-sm transition-all" />
                  {categoryForm.errors.description && <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 uppercase">{categoryForm.errors.description}</p>}
                  
                  <div className="flex gap-4 pt-2">
                    {editingCategory && <button type="button" onClick={() => {setEditingCategory(null); categoryForm.reset();}} className="flex-1 py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm">Annuler</button>}
                    <button type="submit" disabled={categoryForm.processing} className="flex-2 py-4 bg-brand-black text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-brand-orange transition-all shadow-xl shadow-brand-black/10">
                      {categoryForm.processing ? '...' : (editingCategory ? 'METTRE À JOUR' : 'AJOUTER LA CATÉGORIE')}
                    </button>
                  </div>
                </form>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.4em] ml-4 font-sans italic">Index des catégories</h4>
                <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden divide-y divide-gray-50 shadow-sm">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-7 bg-white group hover:bg-orange-50/20 transition-all">
                      <div>
                        <div className="font-black text-gray-900 group-hover:text-brand-orange transition-colors italic">{cat.name}</div>
                        <div className="text-[11px] text-gray-400 mt-1 font-bold italic">{cat.description || 'Description non renseignée'}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {setEditingCategory(cat); categoryForm.setData({name: cat.name, description: cat.description || ''})}} className="p-3 text-gray-300 hover:text-blue-600 hover:bg-white rounded-2xl transition-all shadow-none hover:shadow-xl"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => promptDeleteProp('cat', cat.id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-none hover:shadow-xl"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE SUPPRESSION */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-black/50 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-[3rem] p-12 text-center max-w-sm w-full shadow-2xl animate-fade-in-up">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="font-black text-2xl text-gray-900 mb-3 italic tracking-tighter">SUPPRIMER ?</h3>
            <p className="text-[10px] text-gray-400 mb-10 font-bold uppercase tracking-[0.2em] leading-loose">Cette opération est irréversible et affectera définitivement les données liées.</p>
            <div className="flex flex-col gap-4">
              <button onClick={confirmDelete} className="w-full py-5 bg-red-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-red-200 hover:bg-red-700 transition-all">Oui, Supprimer</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-5 bg-gray-50 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-[1.5rem] hover:bg-gray-100 transition-all">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
