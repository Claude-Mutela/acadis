import { Link } from '@inertiajs/react'
import Layout from '../components/Layout'
import { BookOpen, User, Star } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const valeurs = [
  {
    icon: (
      <BookOpen className="w-8 h-8 stroke-[1.5px]" />
    ),
    title: 'Parole de Dieu',
    description: 'La Bible est notre autorité suprême et le fondement absolu de tout enseignement dispensé à l\'académie.',
  },
  {
    icon: (
      <User className="w-8 h-8 stroke-[1.5px]" />
    ),
    title: 'Caractère',
    description: 'Nous croyons que l\'onction sans caractère mène à la ruine. La transformation intérieure précède le service extérieur.',
  },
  {
    icon: (
      <Star className="w-8 h-8 stroke-[1.5px]" />
    ),
    title: 'Excellence',
    description: 'Servir Dieu exige le meilleur de nous-même. Nous cultivons la rigueur, l\'assiduité et le dévouement.',
  },
]

const equipe = [
  {
    nom: 'Blonsky MBALA',
    role: 'Pasteur Principal',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
  },
  {
    nom: 'Dr. Jean Mukendi',
    role: 'Doyen des Études',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
  },
  {
    nom: 'Rachel Kabeya',
    role: 'Responsable Pédagogique',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  },
  {
    nom: 'David Mulumba',
    role: 'Coordinateur de la Vie Étudiante',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <Layout title="À propos — ACADIS | Académie des Disciples">

      {/* ════════════════════════════════════════════════════════
          1. HEADER SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative bg-black text-white pt-24 pb-32 overflow-hidden">
        {/* Background acccent */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-5" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="inline-block bg-orange/20 text-orange text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Notre Identité
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-8">
            Former pour <span className="text-orange">équiper</span>,<br />
            équiper pour <span className="text-orange">bâtir</span>.
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            L'Académie des Disciples (ACADIS) est le bras éducatif et spirituel de Phila Maison de Témoignages, dédié à forger la prochaine génération de leaders chrétiens.
          </p>
        </div>

        {/* Bottom wave curve */}
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-white block">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="currentColor"/>
          </svg>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          2. HISTOIRE
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Image indicative / Placholder stylisé */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative">
                {/* Image placeholder with abstract Christian representation */}
                <img 
                  src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1000&auto=format&fit=crop" 
                  alt="Étude de la Bible" 
                  className="object-cover w-full h-full opacity-90 mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white text-lg font-medium italic">"Car la parole de Dieu est vivante et efficace..." <br/><span className="text-orange text-sm font-bold">Hébreux 4:12</span></p>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-orange/10 rounded-full blur-2xl -z-10" />
            </div>

            {/* Texte narratif */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-black mb-8">
                Notre Histoire
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  ACADIS est née d'une prière profonde et d'une prise de conscience majeure du <strong>Pasteur Blonsky MBALA</strong> : la moisson est grande, mais les ouvriers qualifiés – tant spirituellement que sur le plan de leur caractère – sont rares.
                </p>
                <p>
                  Depuis sa fondation au sein de <em>Phila Maison de Témoignages</em>, l'académie s'est donné pour mandat de combler le fossé entre la ferveur spirituelle et la maturité doctrinale. Il ne s'agit pas simplement d'accumuler des connaissances théologiques, mais d'amorcer un processus de transformation radicale touchant l'intelligence, le cœur et la vie pratique.
                </p>
                <p>
                  Aujourd'hui, ACADIS forme des centaines d'hommes et de femmes pour qu'ils deviennent des "Doulos" (serviteurs) ancrés dans la doctrine, capables de résister aux vents des fausses doctrines et équipés de manière pratique pour exercer les dons que Dieu leur a confiés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          3. MISSION / VISION / VALEURS
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">
              Ce qui nous définit
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Nos socles spirituels et moraux dictent chaque aspect du fonctionnement de l'académie.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {valeurs.map((valeur, i) => (
              <div 
                key={i} 
                className="bg-white p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl border border-gray-100"
              >
                <div className="w-16 h-16 bg-orange/10 text-orange rounded-2xl flex items-center justify-center mb-6">
                  {valeur.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{valeur.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {valeur.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          4. ÉQUIPE
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Motif décoratif léger */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange/5 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="inline-block bg-orange/10 text-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Le Corps Enseignant
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black">
                Une équipe dédiée à votre croissance
              </h2>
            </div>
            <p className="text-gray-500 md:text-right max-w-sm">
              Des ministères éprouvés, combinant appel spirituel et rigueur académique.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipe.map((membre, i) => (
              <div key={i} className="group">
                {/* Photo de l'équipe */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-5">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse -z-10" />
                  <img 
                    src={membre.photo} 
                    alt={membre.nom} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay en hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm font-medium italic">"Rendre un ministère excellent..."</p>
                  </div>
                </div>
                
                {/* Infos */}
                <h3 className="text-xl font-bold text-black mb-1">{membre.nom}</h3>
                <p className="text-orange font-semibold text-sm uppercase tracking-wide">{membre.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA LIGNE DE FIN
      ════════════════════════════════════════════════════════ */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Prêt à entamer la formation ?</h2>
            <p className="text-gray-400">Rejoignez la prochaine vague d'étudiants d'ACADIS.</p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex items-center justify-center bg-orange hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl transition-all duration-200 shadow-xl"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </section>

    </Layout>
  )
}
