import { useState } from 'react'
import { Link } from '@inertiajs/react'
import Layout from '../components/Layout'
import { Clock, ArrowRight, BookOpen, HandHeart, Award, Heart, User, Landmark, Search } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const categories = ['Tous', 'Fondements', 'Leadership', 'Ministère', 'Spécialisation']

const programmes = [
  {
    id: 1,
    titre: 'Essentielle de la doctrine chrétienne',
    categorie: 'Fondements',
    duree: '3 mois',
    description: 'Une base solide dans la doctrine chrétienne, incluant l\'essentiel de la foi, la repentance et le baptême pour tout nouveau disciple.',
    image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=800&auto=format&fit=crop',
    icon: <BookOpen className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    id: 2,
    titre: 'Face à moi-même',
    categorie: 'Ministère',
    duree: '6 mois',
    description: 'Un parcours d\'introspection pour laisser le Saint-Esprit transformer le caractère et l\'intelligence.',
    image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop',
    icon: <HandHeart className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    id: 3,
    titre: 'École des Ouvriers',
    categorie: 'Ministère',
    duree: '6 mois',
    description: 'Formation intensive pour ceux appelés à servir dans les départements de l\'église locale. Focus sur l\'humilité (Doulos) et l\'excellence.',
    image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop',
    icon: <HandHeart className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    id: 4,
    titre: 'Leadership Biblique',
    categorie: 'Leadership',
    duree: '9 mois',
    description: 'Développer le caractère d\'un Christ-leader. Destiné aux diacres, anciens et responsables de cellules ou de départements.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    icon: <Award className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    id: 5,
    titre: 'École des Dons',
    categorie: 'Spécialisation',
    duree: '1 mois',
    description: 'Une immersion dans le ministère de la prière, le jeûne biblique et le combat spirituel pour soutenir l\'œuvre de Dieu.',
    image: 'https://images.unsplash.com/photo-1445427845353-8b776a3e20e8?q=80&w=800&auto=format&fit=crop',
    icon: <Heart className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    id: 6,
    titre: 'L\'Art de la Prière',
    categorie: 'Fondements',
    duree: '2 semaines',
    description: 'Une immersion dans la vie de prière efficace pour des ouvriers fidèles et puissants.',
    image: 'https://images.unsplash.com/photo-1522881113591-b65be79dce57?q=80&w=800&auto=format&fit=crop',
    icon: <User className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    id: 7,
    titre: 'Gouvernance de l\'Église',
    categorie: 'Leadership',
    duree: '6 mois',
    description: 'Principes d\'administration, éthique pastorale et gestion des ressources selon les directives apostoliques et bibliques.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    icon: <Landmark className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    id: 8,
    titre: 'Doulos',
    categorie: 'Service',
    duree: '1 mois',
    description: 'Apprendre le service, l\' humilité et l\'obéissance à l\'image de Christ, le serviteur par excellence.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    icon: <Landmark className="w-6 h-6" strokeWidth={1.5} />,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function Programmes() {
  const [activeCategory, setActiveCategory] = useState('Tous')

  const filteredProgrammes = activeCategory === 'Tous' 
    ? programmes 
    : programmes.filter(p => p.categorie === activeCategory)

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
            {categories.map((cat) => (
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
                  <div className="h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img 
                      src={prog.image} 
                      alt={prog.titre} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                      <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                        {prog.categorie}
                      </span>
                      <span className="bg-black/80 backdrop-blur-sm text-orange text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {prog.duree}
                      </span>
                    </div>
                  </div>

                  {/* Corps de la Card */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange/10 text-orange flex items-center justify-center rounded-lg text-xl flex-shrink-0">
                        {prog.icon}
                      </div>
                      <h3 className="text-xl font-bold text-black leading-tight group-hover:text-orange transition-colors">
                        {prog.titre}
                      </h3>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                      {prog.description}
                    </p>

                    {/* Bonton d'action au fond */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link 
                        href={`/programme/${prog.id}`} 
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
            href="/contact"
            className="inline-flex bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Formulaire de candidature
          </Link>
        </div>
      </section>

    </Layout>
  )
}
