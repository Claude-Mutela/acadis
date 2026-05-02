import { useEffect, useRef } from 'react'
import { Link, usePage } from '@inertiajs/react'
import Layout from '../components/Layout'
import { BookOpen, ShieldCheck, Wrench, User, Award, HandHeart, Gift, Heart, Clock, ClipboardList, GraduationCap } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const programmes = [
  {
    id: 1,
    icon: <BookOpen className="w-7 h-7" strokeWidth={1.5} />,
    title: 'Essentielle de la doctrine chrétienne',
    description: 'Affermir les disciples dans la foi et les fondamentaux de la Parole de Dieu pour une fondation solide.',
    badge: 'Base',
  },
  {
    id: 2,
    icon: <User className="w-7 h-7" strokeWidth={1.5} />,
    title: 'Face à moi-même',
    description: 'Un parcours d\'introspection pour laisser le Saint-Esprit transformer le caractère et l\'intelligence.',
    badge: '',
  },
  {
    id: 3,
    icon: <Award className="w-7 h-7" strokeWidth={1.5} />,
    title: 'Leadership biblique',
    description: 'Développer le leadership chrétien et se préparer à servir efficacement dans l\'œuvre du Seigneur.',
    badge: 'Avancé',
  },
  {
    id: 4,
    icon: <HandHeart className="w-7 h-7" strokeWidth={1.5} />,
    title: 'Doulos',
    description: 'Apprendre le service, l\'humilité et l\'obéissance à l\'image de Christ, le serviteur par excellence.',
    badge: '',
  },
  {
    id: 5,
    icon: <Gift className="w-7 h-7" strokeWidth={1.5} />,
    title: 'Connaître ses dons',
    description: 'Découvrir et activer vos dons spirituels pour l\'édification du corps de Christ.',
    badge: '',
  },
  {
    id: 6,
    icon: <Heart className="w-7 h-7" strokeWidth={1.5} />,
    title: 'Connaître et pratique la prière',
    description: 'Une immersion dans la vie de prière efficace pour des ouvriers fidèles et puissants.',
    badge: 'Essentiel',
  },
]

const infosPratiques = [
  { value: '4', label: 'Vacations disponibles (Matin, Midi, Soir, Samedi)', icon: <Clock className="w-10 h-10 mx-auto text-orange" strokeWidth={1.5} /> },
  { value: '3', label: 'Absences tolérées avant sanction', icon: <ClipboardList className="w-10 h-10 mx-auto text-orange" strokeWidth={1.5} /> },
  { value: '100%', label: 'Soumission aux valeurs de l\'école', icon: <ShieldCheck className="w-10 h-10 mx-auto text-orange" strokeWidth={1.5} /> },
  { value: 'Diplôme', label: 'Remis à la fin de la formation', icon: <GraduationCap className="w-10 h-10 mx-auto text-orange" strokeWidth={1.5} /> },
]

const temoignages = [
  {
    id: 1,
    name: 'Fr. Emmanuel',
    role: 'Ouvrier engagé',
    avatar: 'EM',
    color: 'bg-orange-500',
    text: 'ACADIS n\'est pas qu\'une simple école biblique. C\'est un lieu de transformation de caractère. Le module "Face à moi-même" a radicalement changé ma perception de l\'œuvre.',
  },
  {
    id: 2,
    name: 'Sr. Sarah',
    role: 'Département Prière',
    avatar: 'SA',
    color: 'bg-blue-600',
    text: 'La profondeur des enseignements sur la doctrine m\'a enracinée. Je me sens maintenant équipée pour répondre à l\'appel de Dieu sur ma vie avec zèle et sagesse.',
  },
  {
    id: 3,
    name: 'Diacre Paul',
    role: 'Leadership',
    avatar: 'PL',
    color: 'bg-indigo-600',
    text: 'La rigueur, la discipline et la qualité du leadership biblique enseigné m\'ont permis de servir mon église avec une nouvelle dimension de maturité.',
  },
]

const galerieImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop', alt: 'Étudiants en formation' },
  { id: 2, src: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=2574&auto=format&fit=crop', alt: 'Étude et partage' },
  { id: 3, src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2574&auto=format&fit=crop', alt: 'Temps de communauté' },
  { id: 4, src: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=2574&auto=format&fit=crop', alt: 'Culte et Adoration' },
  { id: 5, src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2574&auto=format&fit=crop', alt: 'Célébration' },
]

const pointsCles = [
  {
    icon: (
      <BookOpen className="w-6 h-6" />
    ),
    title: 'Connaissance profonde de Dieu',
    description: 'Développer chez les étudiants une connaissance intime de Dieu et de Sa Parole, loin d\'une simple théorie.',
  },
  {
    icon: (
      <ShieldCheck className="w-6 h-6" />
    ),
    title: 'Caractère de Christ',
    description: 'Façonner un caractère conforme à celui de Jésus-Christ : humilité, intégrité, service et discipline.',
  },
  {
    icon: (
      <Wrench className="w-6 h-6" />
    ),
    title: 'Compétences pratiques',
    description: 'Fournir des capacités et outils spirituels concrets pour le ministère et l\'œuvre de la moisson.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────
interface Vacation {
  id: number
  name: string | null
  day: string
  startTime: string
  endTime: string
}

interface Props {
  vacations: Vacation[]
  hasActivePrograms: boolean
}

export default function Home({ vacations, hasActivePrograms }: Props) {
  const { props } = usePage()
  const user = props.user as any
  const carouselRef = useRef<HTMLDivElement>(null)

  // Grouping vacations by day to show unique days if needed, 
  // but the image shows them as individual blocks.
  // We'll group by "Day + Name" or just use them as they are but grouped by unique day.
  // Actually, the user asked for "manière uniques en terme de jour" 
  // and "le jour avec toutes les heures disponibles de chaque jour".
  
  const uniqueDays = Array.from(new Set(vacations.map(v => v.day)))
  const groupedByDay = uniqueDays.map(day => {
    return {
      day,
      slots: vacations.filter(v => v.day === day)
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        
        // Détecte la taille d'un "slide" approximativement grâce à la largeur de l'écran
        const scrollAmount = clientWidth > 1024 ? clientWidth * 0.35 : (clientWidth > 640 ? clientWidth * 0.6 : clientWidth * 0.85)

        // Si on est rendu au bout du défilement
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
      }
    }, 4000) // Change d'image toutes les 4 secondes

    return () => clearInterval(interval)
  }, [])

  return (
    <Layout title="Accueil — ACADIS | Académie des Disciples">

      {/* ════════════════════════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative bg-black text-white overflow-hidden min-h-[85vh] flex items-start">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Orange gradient accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 bg-gradient-to-bl from-orange via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange rounded-full opacity-10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-20 lg:pb-28 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-orange/20 border border-orange/40 rounded-xl px-4 py-1.5 mb-6">
                <span className="text-orange text-sm font-bold">Phila Maison de Témoignages</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight uppercase">
                ACADIS
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-orange mb-6">
                Académie des disciples
              </h2>

              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg border-l-4 border-orange pl-4 italic">
                "Former les disciples pour bâtir une église mature."
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={user ? (user.role === 'student' ? '/etudiant/dashboard' : '/administration/dashboard') : '/signup'}
                  className="inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5 text-base"
                >
                  {user ? 'Accéder à mon espace' : 'S\'inscrire à la prochaine session'}
                </Link>
                <Link
                  href="/programme"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40 text-base backdrop-blur-sm"
                >
                  Nos Programmes
                </Link>
              </div>
            </div>

            {/* Right: Illustration card (Dynamic Vacations) */}
            {hasActivePrograms && vacations.length > 0 && (
              <div className="hidden lg:block relative">
                <div className="relative z-10 bg-gray-900 border border-gray-700/50 rounded-[2rem] p-10 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl p-2 border border-white/10">
                      <img src="/logo ACADIS.png" alt="Logo ACADIS" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xl tracking-tight">Nos Vacations</h3>
                      <p className="text-gray-400 text-sm font-medium">Choisissez votre horaire</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {groupedByDay.map(({ day, slots }) => (
                      <div 
                        key={day} 
                        className={`p-6 rounded-2xl border transition-all duration-300 ${
                          day.toLowerCase().includes('samedi') || day.toLowerCase().includes('dimanche')
                            ? 'bg-orange/10 border-orange/20 hover:bg-orange/20' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-orange font-black text-xs uppercase tracking-[0.2em]">{day}</p>
                          <div className="h-px flex-1 bg-gradient-to-r from-orange/20 to-transparent ml-4"></div>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                          {slots.map(slot => (
                            <div key={slot.id} className="flex items-center gap-3 group/slot">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/slot:bg-orange/20 transition-all">
                                <Clock className="w-4 h-4 text-gray-600 group-hover/slot:text-orange transition-colors" />
                              </div>
                              <div className="flex flex-col">
                                <p className="text-white font-bold text-lg tracking-tight leading-none">
                                  {slot.startTime.slice(0, 5).replace(':', 'H')} 
                                  <span className="mx-1.5 text-gray-500 font-normal text-sm">à</span> 
                                  {slot.endTime.slice(0, 5).replace(':', 'H')}
                                </p>
                                {slot.name && (
                                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1 group-hover/slot:text-orange/80 transition-colors">
                                    {slot.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange/20 rounded-full blur-2xl z-0" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl z-0" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          2. PRÉSENTATION — VISION & OBJECTIFS
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: Text */}
            <div>
              <span className="inline-block bg-orange/10 text-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Vision de l'académie
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight mb-6">
                Une académie née d'une conviction forte
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                L'église de notre génération a besoin d'hommes et de femmes solidement formés dans la Parole de Dieu, transformés dans leur caractère et capables de servir efficacement dans l'œuvre du ministère.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Dans un monde en constante mutation, la formation spirituelle devient une nécessité pour préparer des ouvriers fidèles, capables de vivre et d'annoncer l'Évangile avec sagesse, puissance et intégrité.
              </p>
            </div>

            {/* Right: Points clés */}
            <div className="grid gap-5">
              {pointsCles.map((point, index) => (
                <div
                  key={index}
                  className="flex gap-5 p-6 bg-gray-50 hover:bg-orange/5 border border-gray-100 hover:border-orange/30 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-orange/10 group-hover:bg-orange text-orange group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black mb-1">{point.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          3. MODULES
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block bg-orange/10 text-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Contenu de la formation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">
              Nos Modules
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Un cursus conçu pour afferrmir les disciples, développer le leadership et préparer pour la moisson.
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((prog) => (
              <div
                key={prog.id}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-orange/50 transition-all duration-300 flex flex-col"
              >
                {/* Icon + badge */}
                <div className="flex justify-between items-start mb-5">
                  <div className="w-14 h-14 bg-orange/10 group-hover:bg-orange rounded-2xl flex items-center justify-center text-2xl transition-all duration-300">
                    {prog.icon}
                  </div>
                  {prog.badge && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black text-white">
                      {prog.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-black mb-2">{prog.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-grow">{prog.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          4. ORGANISATION ET RÈGLEMENT
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-orange/20 text-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Règlement & Fonctionnement
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Organisation de l'école
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              L'académie exige discipline, rigueur, respect mutuel et assiduité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infosPratiques.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gray-900 border border-gray-800 hover:border-orange/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <p className="text-4xl sm:text-5xl font-black text-orange mb-2">{stat.value}</p>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Conditions d'admission : Être engagé, accepter la discipline, remplir le formulaire.</p>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          4.5 GALERIE (CARROUSEL)
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
             <span className="inline-block bg-orange/10 text-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
               Galerie ACADIS
             </span>
             <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">
               Immersion dans l'académie
             </h2>
             <p className="text-gray-500 max-w-xl mx-auto text-lg">
               Découvrez en images nos moments forts : temps de formation, d'adoration et de communion fraternelle.
             </p>
        </div>

        {/* Carousel Container */}
        <div 
          ref={carouselRef}
          className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scroll-bar gap-4 sm:gap-6 px-4 sm:px-12 lg:px-24 pb-10 pt-4"
        >
          {galerieImages.map((img) => (
            <div 
               key={img.id}
               className="flex-none w-[85%] sm:w-[60%] md:w-[45%] lg:w-[35%] snap-center rounded-2xl overflow-hidden shadow-lg group relative aspect-[4/3] bg-gray-200"
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-100 flex items-end p-6">
                 <p className="text-white font-bold text-lg lg:text-xl">
                    {img.alt}
                 </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center animate-fade-in-up">
           <Link 
             href="/galerie" 
             className="inline-flex items-center justify-center gap-2 bg-brand-black hover:bg-brand-orange text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-brand-orange/30 group tracking-wide"
           >
             Voir toute la galerie
             <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
           </Link>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          5. PROGRAMME DE CULTE & TÉMOIGNAGES
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Colonne Église */}
            <div className="lg:col-span-1 bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h3 className="text-2xl font-black text-black mb-6">Nous sommes une église Christocentrique</h3>
              <p className="font-bold text-orange mb-6 uppercase tracking-wider text-sm">Programme de Culte</p>
              
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-black font-bold">Mardi : 17H30</p>
                  <p className="text-gray-600">Mardi Malakisi (Culte d'enseignement)</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-black font-bold">Jeudi : 17H30</p>
                  <p className="text-gray-600">Jeudi Etoko (Culte d'intercession)</p>
                </div>
                <div>
                  <p className="text-black font-bold">Dimanche : 8H00</p>
                  <p className="text-gray-600">Culte Dominical / Célébration</p>
                </div>
              </div>
            </div>

            {/* Colonne Témoignages */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2">Témoignages</h2>
                <p className="text-gray-500">Le fruit de notre formation chez nos disciples.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {temoignages.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white border border-gray-200 hover:border-orange hover:shadow-lg rounded-2xl p-6 transition-all duration-300"
                  >
                    <p className="text-gray-600 text-sm mb-6 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${t.color}`}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-black font-bold text-sm">{t.name}</p>
                        <p className="text-gray-400 text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          6. CALL TO ACTION FINAL
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-orange relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 uppercase">
           Mot du Recteur
          </h2>

          <p className="text-white/90 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Ce manuel 
          </p>

          <Link
            href={user ? (user.role === 'student' ? '/etudiant/dashboard' : '/administration/dashboard') : '/signup'}
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-black py-4 px-10 rounded-xl transition-all duration-200 shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 text-lg"
          >
            {user ? 'Retourner au tableau de bord' : 'Remplir le formulaire d\'inscription'}
          </Link>

          {/* Signature */}
          <div className="mt-12 text-white/80">
            <p className="font-bold text-lg mb-1">Pasteur principal</p>
            <p className="text-sm">Blonsky MBALA</p>
          </div>
        </div>
      </section>

    </Layout>
  )
}
