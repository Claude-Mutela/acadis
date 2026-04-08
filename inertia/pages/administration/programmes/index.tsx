import { useState, useMemo } from 'react'
import { Head } from '@inertiajs/react'
import AdminLayout from '../../../components/administration/AdminLayout'
import { 
  Search, Plus, Edit2, Trash2, X, FolderTree, BookOpen, Clock, Users,
  CheckCircle, Target, Award, ListTree, Layers
} from 'lucide-react'

// ── Mock Data Initiale ────────────────────────────────────────────────────────
let catIdCounter = 10
let progIdCounter = 100
let modIdCounter = 1000

const mockCategories = [
  { id: 1, nom: 'Théologie', description: 'Étude fondamentale des écritures' },
  { id: 2, nom: 'Leadership & Ministère', description: 'Formation pour diriger et servir' },
  { id: 3, nom: 'Développement Personnel', description: 'Croissance individuelle et spirituelle' },
]

const mockFormateurs = ['Pasteur Marcello', 'Pasteur Athoms', 'Maman Blanche', 'Frère Joël']

const mockProgrammes = [
  {
    id: 1,
    titre: 'Parcours Fondamental',
    categorie: 'Théologie',
    description: 'Les bases incontournables de la foi chrétienne.',
    presentation: 'Un parcours conçu pour assister chaque nouveau croyant dans ses premiers pas...',
    duree: '6 mois',
    statut: 'Actif',
    formateurs: ['Pasteur Marcello', 'Frère Joël'],
    profilSortie: ['Affermi dans la foi', 'Capable de prier seul', 'Lit la bible régulièrement'],
    objectifs: ['Comprendre le salut', 'Savoir qui est Christ', 'Intégrer une église locale']
  },
  {
    id: 2,
    titre: 'École des Ouvriers',
    categorie: 'Leadership & Ministère',
    description: 'Former les mains qui serviront à la moisson.',
    presentation: 'Cette école prépare spécifiquement ceux qui sont appelés à servir dans les départements...',
    duree: '3 mois',
    statut: 'Actif',
    formateurs: ['Maman Blanche'],
    profilSortie: ['Ouvrier qualifié', 'Connaît l\'éthique du service'],
    objectifs: ['Apprendre la soumission', 'Comprendre le fonctionnement de l\'église']
  }
]

const mockModules = [
  { id: 1, programmeId: 1, nom: 'Introduction à la Bible', description: 'Structure et histoire de la bible', dureeHeures: 10 },
  { id: 2, programmeId: 1, nom: 'La nouvelle naissance', description: 'Ce qu\'est le salut', dureeHeures: 5 },
  { id: 3, programmeId: 2, nom: 'Le cœur du serviteur', description: 'Motivations et attitudes', dureeHeures: 8 },
]

// ── Types ──────────────────────────────────────────────────────────────────────
type Categorie = typeof mockCategories[0]
type Programme = typeof mockProgrammes[0]
type Module = typeof mockModules[0]

// ── Composant Principal ───────────────────────────────────────────────────────
export default function ProgrammesIndex() {
  // States: Data
  const [categories, setCategories] = useState<Categorie[]>(mockCategories)
  const [programmes, setProgrammes] = useState<Programme[]>(mockProgrammes)
  const [modules, setModules] = useState<Module[]>(mockModules)
  
  // States: UI/Filtres
  const [searchProg, setSearchProg] = useState('')

  // States: Modales Ouvertes
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [isProgModalOpen, setIsProgModalOpen] = useState(false)
  const [isModModalOpen, setIsModModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'cat' | 'prog' | 'mod', id: number } | null>(null)

  // States: Formulaires Courants
  const [progTab, setProgTab] = useState<'infos' | 'pedagogie'>('infos')
  const [progMode, setProgMode] = useState<'create' | 'edit'>('create')
  const [currentProg, setCurrentProg] = useState<Programme | null>(null)

  const [currentCat, setCurrentCat] = useState<Partial<Categorie>>({ nom: '', description: '' })
  
  const [activeProgForModules, setActiveProgForModules] = useState<Programme | null>(null)
  const [currentMod, setCurrentMod] = useState<Partial<Module>>({ nom: '', description: '', dureeHeures: 0 })
  const [modFormVisible, setModFormVisible] = useState(false)

  // ── Logique Programmes ───────────────────────────────────────────────────────
  const filteredProgrammes = programmes.filter(p => 
    p.titre.toLowerCase().includes(searchProg.toLowerCase()) || 
    p.categorie.toLowerCase().includes(searchProg.toLowerCase())
  )

  const openProgModal = (prog?: Programme) => {
    setProgTab('infos')
    if (prog) {
      setProgMode('edit')
      setCurrentProg(JSON.parse(JSON.stringify(prog))) // Deep copy
    } else {
      setProgMode('create')
      setCurrentProg({
        id: 0, titre: '', categorie: categories[0]?.nom || '', description: '',
        presentation: '', duree: '', statut: 'Brouillon', formateurs: [],
        profilSortie: [''], objectifs: ['']
      })
    }
    setIsProgModalOpen(true)
  }

  const handleSaveProg = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentProg) return
    // Nettoyer les champs vides dans les tableaux
    const cleanedProg = {
      ...currentProg,
      profilSortie: currentProg.profilSortie.filter(i => i.trim() !== ''),
      objectifs: currentProg.objectifs.filter(i => i.trim() !== '')
    }

    if (progMode === 'create') {
      progIdCounter++
      setProgrammes([{ ...cleanedProg, id: progIdCounter }, ...programmes])
    } else {
      setProgrammes(programmes.map(p => p.id === cleanedProg.id ? cleanedProg : p))
    }
    setIsProgModalOpen(false)
  }

  const promptDeleteProg = (prog: Programme) => {
    setDeleteTarget({ type: 'prog', id: prog.id })
    setIsDeleteModalOpen(true)
  }

  // Helper pour les tableaux dynamiques (Objectifs, Profil)
  const updateArrayField = (field: 'profilSortie' | 'objectifs', index: number, value: string) => {
    if (!currentProg) return
    const newArr = [...currentProg[field]]
    newArr[index] = value
    setCurrentProg({ ...currentProg, [field]: newArr })
  }
  const addArrayItem = (field: 'profilSortie' | 'objectifs') => {
    if (!currentProg) return
    setCurrentProg({ ...currentProg, [field]: [...currentProg[field], ''] })
  }
  const removeArrayItem = (field: 'profilSortie' | 'objectifs', index: number) => {
    if (!currentProg) return
    const newArr = [...currentProg[field]]
    newArr.splice(index, 1)
    setCurrentProg({ ...currentProg, [field]: newArr })
  }

  // ── Logique Catégories ───────────────────────────────────────────────────────
  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentCat.id) {
      setCategories(categories.map(c => c.id === currentCat.id ? currentCat as Categorie : c))
    } else {
      catIdCounter++
      setCategories([...categories, { ...currentCat, id: catIdCounter } as Categorie])
    }
    setCurrentCat({ nom: '', description: '' })
  }

  const promptDeleteCat = (catId: number) => {
    setDeleteTarget({ type: 'cat', id: catId })
    setIsDeleteModalOpen(true)
  }

  // ── Logique Modules ─────────────────────────────────────────────────────────
  const openModulesModal = (prog: Programme) => {
    setActiveProgForModules(prog)
    setModFormVisible(false)
    setCurrentMod({ nom: '', description: '', dureeHeures: 0 })
    setIsModModalOpen(true)
  }

  const progModules = useMemo(() => {
    if (!activeProgForModules) return []
    return modules.filter(m => m.programmeId === activeProgForModules.id)
  }, [modules, activeProgForModules])

  const handleSaveMod = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeProgForModules) return
    if (currentMod.id) {
      setModules(modules.map(m => m.id === currentMod.id ? currentMod as Module : m))
    } else {
      modIdCounter++
      setModules([...modules, { ...currentMod, id: modIdCounter, programmeId: activeProgForModules.id } as Module])
    }
    setModFormVisible(false)
    setCurrentMod({ nom: '', description: '', dureeHeures: 0 })
  }

  const promptDeleteMod = (modId: number) => {
    setDeleteTarget({ type: 'mod', id: modId })
    setIsDeleteModalOpen(true)
  }

  // ── Suppression Générale ────────────────────────────────────────────────────
  const confirmDelete = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'cat') {
      setCategories(categories.filter(c => c.id !== deleteTarget.id))
    } else if (deleteTarget.type === 'prog') {
      setProgrammes(programmes.filter(p => p.id !== deleteTarget.id))
      setModules(modules.filter(m => m.programmeId !== deleteTarget.id))
    } else if (deleteTarget.type === 'mod') {
      setModules(modules.filter(m => m.id !== deleteTarget.id))
    }
    setIsDeleteModalOpen(false)
    setDeleteTarget(null)
  }

  // ── Rendu de l'UI ────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Programmes & Ingénierie Pédagogique">
      <Head title="Programmes — Admin ACADIS" />
      
      {/* 1. Header de Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Programmes de formation</h1>
          <p className="text-gray-500 mt-1">Gérez le catalogue des programmes, catégories et modules.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCatModalOpen(true)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-5 rounded-xl text-sm transition-all"
          >
            <FolderTree className="w-5 h-5" />
            Catégories
          </button>
          <button 
            onClick={() => openProgModal()}
            className="flex items-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Nouveau Programme
          </button>
        </div>
      </div>

      {/* 2. Recherche et Liste des Programmes */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher un programme par titre, catégorie..."
            value={searchProg} onChange={e => setSearchProg(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Titre / Description</th>
                <th className="px-6 py-4">Détails (Catégorie, Durée)</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-center">Modules</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProgrammes.length > 0 ? filteredProgrammes.map(prog => (
                <tr key={prog.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-base">{prog.titre}</div>
                    <div className="text-sm text-gray-500 mt-0.5 truncate max-w-sm">{prog.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange/10 text-orange border border-orange/20 text-xs font-bold mb-1">
                      <FolderTree className="w-3 h-3" /> {prog.categorie}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {prog.duree}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      prog.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {prog.statut === 'Actif' ? <CheckCircle className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                      {prog.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => openModulesModal(prog)}
                      className="inline-flex flex-col items-center justify-center p-2 rounded-lg hover:bg-orange/10 text-orange transition-colors"
                    >
                      <ListTree className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{modules.filter(m => m.programmeId === prog.id).length} Modules</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openProgModal(prog)}
                        className="p-1.5 bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg" title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => promptDeleteProg(prog)}
                        className="p-1.5 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg" title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Aucun programme trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALE 1 : CRUD PROGRAMME */}
      {/* ========================================================================= */}
      {isProgModalOpen && currentProg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProgModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Header Modale */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange" />
                {progMode === 'create' ? 'Créer un Programme' : 'Modifier le Programme'}
              </h3>
              <button onClick={() => setIsProgModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Onglets */}
            <div className="flex px-6 border-b border-gray-100 flex-shrink-0 bg-white">
              <button 
                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${progTab === 'infos' ? 'border-orange text-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                onClick={() => setProgTab('infos')}
              >
                Informations Générales
              </button>
              <button 
                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${progTab === 'pedagogie' ? 'border-orange text-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                onClick={() => setProgTab('pedagogie')}
              >
                Cibles & Pédagogie
              </button>
            </div>

            {/* Corps du Formulaire */}
            <form id="progForm" onSubmit={handleSaveProg} className="overflow-y-auto flex-1 p-6 bg-white space-y-6">
              
              {/* ONGLET 1: INFOS */}
              <div className={progTab === 'infos' ? 'block' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Titre du Programme</label>
                    <input 
                      type="text" required value={currentProg.titre} 
                      onChange={e => setCurrentProg({...currentProg, titre: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange focus:border-transparent outline-none transition-all font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Catégorie</label>
                    <select 
                      required value={currentProg.categorie} 
                      onChange={e => setCurrentProg({...currentProg, categorie: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange appearance-none outline-none cursor-pointer"
                    >
                      <option value="" disabled>Choisir une catégorie...</option>
                      {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Durée (ex: 6 mois)</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" required value={currentProg.duree} 
                        onChange={e => setCurrentProg({...currentProg, duree: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Statut de publication</label>
                    <select 
                      value={currentProg.statut} 
                      onChange={e => setCurrentProg({...currentProg, statut: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange appearance-none outline-none cursor-pointer"
                    >
                      <option value="Actif">Actif (Public)</option>
                      <option value="Brouillon">Brouillon (Caché)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Formateur(s) Principal(aux)</label>
                    {/* Multiselect simplifié => Ici un select multiple natif pour la démonstration */}
                    <select 
                      multiple size={3} value={currentProg.formateurs} 
                      onChange={e => setCurrentProg({...currentProg, formateurs: Array.from(e.target.selectedOptions, option => option.value)})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                    >
                      {mockFormateurs.map(f => <option key={f} value={f} className="py-1">{f}</option>)}
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">Maintenez CTRL pour en sélectionner plusieurs.</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Description (Courte)</label>
                    <input 
                      type="text" required value={currentProg.description} 
                      onChange={e => setCurrentProg({...currentProg, description: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Présentation Détaillée</label>
                    <textarea 
                      required rows={4} value={currentProg.presentation} 
                      onChange={e => setCurrentProg({...currentProg, presentation: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* ONGLET 2: PEDAGOGIE */}
              <div className={progTab === 'pedagogie' ? 'block' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Objectifs Dynamiques */}
                  <div className="bg-orange/5 p-4 rounded-2xl border border-orange/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-black text-gray-900 flex items-center gap-2"><Target className="w-4 h-4 text-orange" /> Objectifs Vises</h4>
                      <button type="button" onClick={() => addArrayItem('objectifs')} className="p-1.5 bg-orange text-white rounded-md hover:bg-orange-600 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {currentProg.objectifs.map((obj, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            type="text" placeholder="Ex: Comprendre les dons de l'esprit..." value={obj} 
                            onChange={e => updateArrayField('objectifs', i, e.target.value)}
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange outline-none"
                          />
                          <button type="button" onClick={() => removeArrayItem('objectifs', i)} disabled={currentProg.objectifs.length === 1} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg disabled:opacity-30 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profil de Sortie Dynamique */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-black text-gray-900 flex items-center gap-2"><Award className="w-4 h-4 text-blue-500" /> Profil de Sortie</h4>
                      <button type="button" onClick={() => addArrayItem('profilSortie')} className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {currentProg.profilSortie.map((profil, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            type="text" placeholder="Ex: Capable de tenir une prière..." value={profil} 
                            onChange={e => updateArrayField('profilSortie', i, e.target.value)}
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <button type="button" onClick={() => removeArrayItem('profilSortie', i)} disabled={currentProg.profilSortie.length === 1} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg disabled:opacity-30 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </form>

            {/* Footer Modale */}
            <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 flex-shrink-0">
              <button onClick={() => setIsProgModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors">
                Annuler
              </button>
              <button type="submit" form="progForm" className="flex-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                Enregistrer le Programme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 2 : GESTION DES CATEGORIES */}
      {/* ========================================================================= */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><FolderTree className="w-5 h-5 text-orange" /> Gérer les Catégories</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-8">
              {/* Formulaire ajout/modif Catégorie */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <h4 className="text-sm font-black text-gray-800 mb-4">{currentCat.id ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}</h4>
                <form onSubmit={handleSaveCat} className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="flex-1 w-full space-y-3">
                    <input 
                      type="text" required placeholder="Nom de la catégorie" value={currentCat.nom} onChange={e => setCurrentCat({...currentCat, nom: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none font-bold"
                    />
                    <input 
                      type="text" required placeholder="Description courte" value={currentCat.description} onChange={e => setCurrentCat({...currentCat, description: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                    {currentCat.id && <button type="button" onClick={() => setCurrentCat({ nom: '', description: ''})} className="py-2.5 px-3 bg-white border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-100"><X className="w-4 h-4" /></button>}
                    <button type="submit" className="flex-1 sm:flex-none py-2.5 px-5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                      {currentCat.id ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Table Catégories */}
              <div>
                <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Catégories existantes</h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 group">
                      <div>
                        <div className="font-bold text-gray-900">{cat.nom}</div>
                        <div className="text-xs text-gray-500">{cat.description}</div>
                      </div>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setCurrentCat(cat)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => promptDeleteCat(cat.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && <div className="p-4 text-center text-sm text-gray-500">Aucune catégorie</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 3 : GESTION DES MODULES (Pour un programme spécifique) */}
      {/* ========================================================================= */}
      {isModModalOpen && activeProgForModules && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up">
            
            <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-orange/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><ListTree className="w-5 h-5 text-orange" /> Modules du programme</h3>
                <p className="text-orange font-bold text-sm mt-1">{activeProgForModules.titre}</p>
              </div>
              <button onClick={() => setIsModModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-gray-700">Cursus Pédagogique ({progModules.length})</h4>
                <button 
                  onClick={() => { setCurrentMod({nom:'', description:'', dureeHeures:0}); setModFormVisible(true); }}
                  className="px-4 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Ajouter un module
                </button>
              </div>

              {/* Formulaire Ajout/Modif Module (Conditionally Rendered) */}
              {modFormVisible && (
                <form onSubmit={handleSaveMod} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6 animate-fade-in-up">
                  <h5 className="text-sm font-black text-gray-900 mb-4">{currentMod.id ? 'Modifier le module' : 'Nouveau module'}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Nom du module</label>
                      <input type="text" required value={currentMod.nom} onChange={e => setCurrentMod({...currentMod, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange outline-none font-bold" />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Durée (Heures)</label>
                      <input type="number" required min="1" value={currentMod.dureeHeures || ''} onChange={e => setCurrentMod({...currentMod, dureeHeures: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange outline-none" />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Description du cours</label>
                      <input type="text" required value={currentMod.description} onChange={e => setCurrentMod({...currentMod, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange outline-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setModFormVisible(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition-colors">Annuler</button>
                    <button type="submit" className="px-5 py-2 bg-orange text-white text-sm font-bold rounded-lg hover:bg-orange-600 shadow-md shadow-orange/20 transition-colors">{currentMod.id ? 'Enregistrer' : 'Ajouter'}</button>
                  </div>
                </form>
              )}

              {/* Liste des Modules */}
              <div className="space-y-3">
                {progModules.map((mod, index) => (
                  <div key={mod.id} className="bg-white border border-gray-200 p-4 rounded-xl flex items-start justify-between group hover:border-orange/50 hover:shadow-sm transition-all">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-black text-sm flex items-center justify-center flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">{mod.nom} <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded ml-2">{mod.dureeHeures} heures</span></h5>
                        <p className="text-sm text-gray-500 mt-1">{mod.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100">
                      <button onClick={() => {setCurrentMod(mod); setModFormVisible(true);}} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => promptDeleteMod(mod.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {progModules.length === 0 && !modFormVisible && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <ListTree className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-bold">Aucun module dans ce programme.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 4 : SUPPRESSION GENERIQUE */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Êtes-vous sûr ?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Voulez-vous vraiment supprimer cet élément ({deleteTarget.type === 'cat' ? 'Catégorie' : deleteTarget.type === 'prog' ? 'Programme et ses modules' : 'Module'}) ? Cette action est irréversible.
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
