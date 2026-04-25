import { useState, useRef } from 'react'
import { Head } from '@inertiajs/react'
import AdminLayout from '../../components/administration/AdminLayout'
import { Camera, Save, UserCircle2, Mail, Phone, CheckCircle, Shield } from 'lucide-react'

export default function AdminProfil() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  
  const [profile, setProfile] = useState({
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'direction@acadis.org',
    telephone: '+243 999 000 000',
    fonction: 'Directeur Académique',
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
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <AdminLayout title="Mon Profil" description="Gérez vos accès et vos informations personnelles administratives.">
      <Head title="Profil — Admin ACADIS" />


      <form onSubmit={handleSave} className="max-w-4xl space-y-8">
        
        {/* Encart Haut : Photo */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 bg-gray-100 shadow-inner flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} alt="Profil Administrateur" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-gray-300">JD</span>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-bold border border-purple-100">
              <Shield className="w-4 h-4" /> Administrateur Système
            </div>
          </div>
        </div>

        {/* Formulaire détaillé */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-orange" /> Données Personnelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom</label>
              <input type="text" value={profile.prenom} onChange={e => setProfile({...profile, prenom: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom de famille</label>
              <input type="text" value={profile.nom} onChange={e => setProfile({...profile, nom: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5"><Phone className="w-4 h-4 inline-block mr-1"/> Téléphone Pro.</label>
              <input type="tel" value={profile.telephone} onChange={e => setProfile({...profile, telephone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5"><Mail className="w-4 h-4 inline-block mr-1"/> Email Institutionnel</label>
              <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange outline-none" />
            </div>
            <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-4">Sécurité du compte</h3>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-not-allowed opacity-70">
                <div>
                  <p className="font-bold text-gray-900 text-sm">Mot de passe administrateur</p>
                  <p className="text-gray-500 text-xs mt-0.5">Dernière modification il y a 3 mois.</p>
                </div>
                <button type="button" disabled className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-500">Changer de mot de passe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end gap-4">
          {isSaved && (
            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-3 rounded-xl animate-fade-in-up">
              <CheckCircle className="w-5 h-5" /> Enregistré
            </div>
          )}
          <button type="submit" className="bg-orange hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Save className="w-5 h-5" /> Mettre à jour le profil 
          </button>
        </div>

      </form>
    </AdminLayout>
  )
}
