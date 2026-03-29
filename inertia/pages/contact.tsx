import { useState } from 'react'

import Layout from '../components/Layout'
import { MapPin, Phone, CheckCircle2, Loader2, Send } from 'lucide-react'

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: 'Inscription',
    message: '',
  })

  // Simule l'envoi du formulaire pour la démo UI
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({ nom: '', email: '', telephone: '', sujet: 'Inscription', message: '' })
      setTimeout(() => setIsSuccess(false), 5000)
    }, 1500)
  }

  return (
    <Layout title="Contact — ACADIS | Académie des Disciples">

      {/* ════════════════════════════════════════════════════════
          1. HEADER SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="bg-black text-white pt-24 pb-20 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="inline-block bg-orange/20 text-orange font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full mb-6">
            Nous Contacter
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Prenez contact avec <span className="text-orange">l'Académie</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Pour toute question concernant nos programmes de discipolat, les inscriptions ou le fonctionnement de l'école, l'équipe d'ACADIS est à votre disposition.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. CONTACT INFOS & FORMULAIRE
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 min-h-screen relative -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Colonne Gauche : Coordonnées */}
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-black mb-8">Nos Coordonnées</h2>
                
                <div className="space-y-8">
                  {/* Adresse */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange/10 text-orange rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">Siège ACADIS</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Phila Maison de Témoignages<br />
                        Zoao N°25, Q/ Matonge 1<br />
                        Blvd Sendwe / Entrée hôtel Sendwe<br />
                        Kinshasa - RD Congo<br />
                        BP: 6270
                      </p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange/10 text-orange rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">Téléphone</h3>
                      <p className="text-gray-500 text-sm">
                        +243 99 997 56 28
                      </p>
                      <p className="text-orange text-xs font-bold mt-1 uppercase tracking-wider">Lundi à Samedi, 8h - 17h</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Box Horaire Culte (Bonus contextuel) */}
              <div className="bg-black text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange rounded-full blur-2xl opacity-20" />
                <h3 className="text-xl font-bold mb-6">Programmes de Culte</h3>
                <ul className="space-y-4 text-sm text-gray-300">
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="font-bold text-white">Mardi (Malakisi)</span>
                    <span className="text-orange">17H30</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="font-bold text-white">Jeudi (Etoko)</span>
                    <span className="text-orange">17H30</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold text-white">Dimanche</span>
                    <span className="text-orange">8H00</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 relative top-[-60px]">
                <h2 className="text-2xl font-black text-black mb-2">Envoyez-nous un message</h2>
                <p className="text-gray-500 text-sm mb-8">Nous vous répondrons dans les plus brefs délais.</p>

                {isSuccess && (
                  <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3 animate-fade-in-up">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold">Message envoyé avec succès !</h4>
                      <p className="text-sm">Que la grâce du Seigneur soit avec vous. Nous traiterons votre demande rapidement.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nom */}
                    <div className="space-y-2">
                      <label htmlFor="nom" className="block text-sm font-bold text-gray-700">Nom complet <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="nom"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700">Adresse email <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Téléphone */}
                    <div className="space-y-2">
                      <label htmlFor="telephone" className="block text-sm font-bold text-gray-700">Numéro de téléphone</label>
                      <input 
                        type="tel" 
                        id="telephone"
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all"
                        placeholder="+243 ..."
                      />
                    </div>

                    {/* Sujet */}
                    <div className="space-y-2">
                      <label htmlFor="sujet" className="block text-sm font-bold text-gray-700">Sujet de votre message</label>
                      <select 
                        id="sujet"
                        value={formData.sujet}
                        onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all bg-white"
                      >
                        <option value="Inscription">Demande d'inscription</option>
                        <option value="Information">Demande d'information générale</option>
                        <option value="Partenariat">Partenariat / Ministère</option>
                        <option value="Autre">Autre requête</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700">Votre message <span className="text-red-500">*</span></label>
                    <textarea 
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all resize-none"
                      placeholder="Comment pouvons-nous vous aider ?"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    Toutes les informations soumises sont confidentielles.
                  </p>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

    </Layout>
  )
}
