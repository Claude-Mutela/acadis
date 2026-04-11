import { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '../../components/Layout'
import { ImageIcon, Folder, Grid3X3 } from 'lucide-react'
import { MOCK_ALBUMS, ALBUM_CATEGORIES } from '../../utils/mock_galerie'

export default function GalerieIndex() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const filteredAlbums = MOCK_ALBUMS.filter(album => 
    selectedCategory === 'Tous' ? true : album.category === selectedCategory
  )

  return (
    <Layout title="Galerie — ACADIS">
      <Head title="Galerie — ACADIS | Académie des Disciples" />

      {/* Hero Header */}
      <section className="bg-brand-black text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-white rounded-full opacity-5 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
          <ImageIcon className="w-12 h-12 text-brand-orange mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight">Galerie Photo</h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Explorez nos différents dossiers thématiques pour revivre les temps forts de l'Académie.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Conteneur Filtres */}
          <div className="mb-10 flex justify-center">
            {/* Version Mobile: Select */}
            <div className="w-full md:hidden relative">
               <select 
                 className="w-full appearance-none bg-white border border-gray-200 text-gray-900 py-3.5 pl-4 pr-10 rounded-xl font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-light"
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
               >
                 {ALBUM_CATEGORIES.map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                 <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                   <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                 </svg>
               </div>
            </div>

            {/* Version Desktop/Tablette: Onglets Flexibles */}
            <div className="hidden md:flex flex-wrap justify-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
              {ALBUM_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    selectedCategory === cat 
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Alert si vide */}
          {filteredAlbums.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
              <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun album trouvé</h3>
              <p className="text-gray-500">Il n'y a pas encore d'album dans la catégorie "{selectedCategory}".</p>
            </div>
          )}

          {/* Grille d'Albums */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 content-start">
            {filteredAlbums.map((album) => (
              <Link
                key={album.id} 
                href={`/galerie/${album.slug}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full"
              >
                {/* Image de couverture */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={album.coverSrc} 
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Badge Compteur d'images */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {album.imageCount}
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-6 flex-grow flex flex-col">
                  <span className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5" />
                    {album.category}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-brand-orange transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                    {album.description}
                  </p>
                  
                  {/* Lien visuel */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-sm font-bold text-gray-900 group-hover:text-brand-orange transition-colors">
                    Ouvrir l'album
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </Layout>
  )
}
