import { useState } from 'react'
import { Link } from '@inertiajs/react'
import Layout from '../components/Layout'
import { Clock, ArrowRight, BookOpen, HandHeart, Award, Heart, User, Landmark, Search } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

export interface Program {
  id: number
  name: string
  slug: string
  description: string
  duration: string
  coverImage: string | null
  categoryId: number | null
  category?: {
    id: number
    name: string
  }
}

export interface Category {
  id: number
  name: string
}

export interface Props {
  programs: Program[]
  categories: Category[]
}

// Icon mapping helper
const getProgramIcon = (title: string) => {
  const t = title.toLowerCase()
  if (t.includes('doctrine') || t.includes('bible')) return <BookOpen className="w-6 h-6" strokeWidth={1.5} />
  if (t.includes('face') || t.includes('moi')) return <HandHeart className="w-6 h-6" strokeWidth={1.5} />
  if (t.includes('leadership')) return <Award className="w-6 h-6" strokeWidth={1.5} />
  if (t.includes('prière')) return <Heart className="w-6 h-6" strokeWidth={1.5} />
  if (t.includes('gouvernance')) return <Landmark className="w-6 h-6" strokeWidth={1.5} />
  return <BookOpen className="w-6 h-6" strokeWidth={1.5} />
}

export default function Programmes({ programs, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('Tous')

  const categoryNames = ['Tous', ...categories.map(c => c.name)]

  const filteredProgrammes = activeCategory === 'Tous' 
    ? programs 
    : programs.filter(p => p.category?.name === activeCategory)

  return (
    <Layout title="Programmes — ACADIS | Académie des Disciples">
      
      {/* ════════════════════════════════════════════════════════
          1. HEADER SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="bg-black text-white pt-24 pb-20 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="inline-block bg-orange/20 text-orange font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-full mb-6">
            Nos Formations
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-6">
            Catalogue des <span className="text-orange">Programmes</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Découvrez nos parcours de formation conçus pour asseoir votre foi, développer votre caractère et vous équiper pour le ministère.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. FILTRES + GRILLE DE PROGRAMMES
      ════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 flex-grow min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Menu de filtres */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                  activeCategory === cat
                    ? 'bg-orange text-white ring-2 ring-orange ring-offset-2 ring-offset-gray-50'
                    : 'bg-white text-gray-600 hover:text-orange border border-gray-200 hover:border-orange hover:bg-orange/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Nombre de résultats */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black border-l-4 border-orange pl-4">
              {filteredProgrammes.length} programme{filteredProgrammes.length > 1 ? 's' : ''} disponible{filteredProgrammes.length > 1 ? 's' : ''}
              {activeCategory !== 'Tous' && <span className="text-gray-400 font-normal"> dans "{activeCategory}"</span>}
            </h2>
          </div>

          {/* Grille */}
          {filteredProgrammes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
              {filteredProgrammes.map((prog) => (
                <div 
                  key={prog.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Image Card */}
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    {prog.coverImage ? (
                      <img 
                        src={prog.coverImage} 
                        alt={prog.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange/5 text-orange/20">
                        <BookOpen className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                      <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                        {prog.category?.name || 'Général'}
                      </span>
                      <span className="bg-black/80 backdrop-blur-sm text-orange text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {prog.duration}
                      </span>
                    </div>
                  </div>

                  {/* Corps de la Card */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange/10 text-orange flex items-center justify-center rounded-lg text-xl flex-shrink-0">
                        {getProgramIcon(prog.name)}
                      </div>
                      <h3 className="text-xl font-bold text-black leading-tight group-hover:text-orange transition-colors">
                        {prog.name}
                      </h3>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                      {prog.description}
                    </p>

                    {/* Bonton d'action au fond */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link 
                        href={`/programme/${prog.slug}`} 
                        className="flex items-center justify-between text-orange font-bold text-sm hover:text-orange-600 transition-colors group/btn"
                      >
                        Voir les détails du programme
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Aucun programme trouvé</h3>
              <p className="text-gray-500">Il n'y a actuellement aucun programme dans la catégorie "{activeCategory}".</p>
              <button 
                onClick={() => setActiveCategory('Tous')}
                className="mt-6 font-bold text-orange hover:underline"
              >
                Afficher tous les programmes
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. CTA BOTTOM
      ════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-black mb-4">Un parcours vous intéresse ?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Les inscriptions pour la prochaine vague de formation sont actuellement ouvertes. Prenez votre place dès aujourd'hui.
          </p>
          <Link
            href="/signup"
            className="inline-flex bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Formulaire de candidature
          </Link>
        </div>
      </section>

    </Layout>
  )
}
