import { useState, useRef } from 'react'
import { Head } from '@inertiajs/react'
import StudentLayout from '../../components/etudiant/StudentLayout'
import { Camera, Save, UserCircle2, Mail, Phone, MapPin, Building2, CheckCircle } from 'lucide-react'

export default function StudentProfil() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  
  // State du profil complet (identique aux champs demandés dans l'admin)
  const [profile, setProfile] = useState({
    prenom: 'Emmanuel',
    nom: 'Béni',
    email: 'emmanuel.beni@example.com',
    telephone: '+243 990 000 000',
    sexe: 'M',
    dateNaissance: '2000-01-01',
    adresse: '',
    egliseAttache: 'Église Compassion',
    departement: 'Intercession',
    estOuvrier: 'Oui'
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation sauvegarde
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <StudentLayout title="Mon ProfilPersonnel">
      <Head title="Profil — Espace Étudiant" />

      <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8">
        
        {/* Encart Photo & Identité rapide */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 bg-gray-100 shadow-inner flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 className="w-20 h-20 text-gray-300" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 bg-orange w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-white shadow-md">
              <Camera className="w-4 h-4" />
            </div>
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-gray-900 mb-1">{profile.prenom} {profile.nom}</h2>
            <p className="text-gray-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" /> {profile.email}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
              Étudiant Actif
            </div>
          </div>
        </div>

        {/* Formulaire détaillé */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-orange" /> Informations Personnelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom</label>
              <input type="text" value={profile.prenom} onChange={e => setProfile({...profile, prenom: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom</label>
              <input type="text" value={profile.nom} onChange={e => setProfile({...profile, nom: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5"><Phone className="w-4 h-4 inline-block mr-1"/> Téléphone</label>
              <input type="tel" value={profile.telephone} onChange={e => setProfile({...profile, telephone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5"><Mail className="w-4 h-4 inline-block mr-1"/> Email</label>
              <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Sexe</label>
              <select value={profile.sexe} onChange={e => setProfile({...profile, sexe: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none">
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Date de Naissance</label>
              <input type="date" value={profile.dateNaissance} onChange={e => setProfile({...profile, dateNaissance: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5"><MapPin className="w-4 h-4 inline-block mr-1"/> Adresse complète</label>
              <textarea value={profile.adresse} onChange={e => setProfile({...profile, adresse: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none h-24 resize-none" placeholder="Ex: 27 A, Rue des Martyrs, Kinshasa" />
            </div>
          </div>
        </div>

        {/* Parcours Spirituel */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange" /> Parcours Spirituel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Église d'attache</label>
              <input type="text" value={profile.egliseAttache} onChange={e => setProfile({...profile, egliseAttache: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" placeholder="Quelle est l'église où vous priez ?" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Êtes-vous ouvrier/serviteur ?</label>
              <select value={profile.estOuvrier} onChange={e => setProfile({...profile, estOuvrier: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none">
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </div>
            {profile.estOuvrier === 'Oui' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Département (Si oui)</label>
                <input type="text" value={profile.departement} onChange={e => setProfile({...profile, departement: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" placeholder="Ex: Chorale, Accueil, Média..." />
              </div>
            )}
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end gap-4">
          {isSaved && (
            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-3 rounded-xl animate-fade-in-up">
              <CheckCircle className="w-5 h-5" /> Sauvegardé avec succès
            </div>
          )}
          <button type="submit" className="bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Save className="w-5 h-5" /> Enregistrer mes informations
          </button>
        </div>

      </form>
    </StudentLayout>
  )
}
