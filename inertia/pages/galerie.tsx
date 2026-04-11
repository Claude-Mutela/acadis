import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import Layout from '../components/Layout'
import { ImageIcon, ChevronLeft, ChevronRight, Grid3X3, X } from 'lucide-react'

// ── MOCK DATA ─────────────────────────────────────────────────────────────
const ALBUMS = ['Tous', 'Formation', 'Culte et Adoration', 'Communauté', 'Evangélisation']

const MOCK_IMAGES = [
  { id: 1, album: 'Formation', src: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop', title: 'Cours d\'herméneutique' },
  { id: 2, album: 'Culte et Adoration', src: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=2574&auto=format&fit=crop', title: 'Adoration dominicale' },
  { id: 3, album: 'Communauté', src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2574&auto=format&fit=crop', title: 'Partage en groupe' },
  { id: 4, album: 'Formation', src: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=2574&auto=format&fit=crop', title: 'Étude biblique personelle' },
  { id: 5, album: 'Evangélisation', src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2574&auto=format&fit=crop', title: 'Mission locale' },
  { id: 6, album: 'Culte et Adoration', src: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2574&auto=format&fit=crop', title: 'Moment de prière' },
  { id: 7, album: 'Formation', src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2574&auto=format&fit=crop', title: 'Travail de groupe' },
  { id: 8, album: 'Communauté', src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2574&auto=format&fit=crop', title: 'Repas fraternel' },
  { id: 9, album: 'Evangélisation', src: 'https://images.unsplash.com/photo-1526976663112-0015bdcbfc6f?q=80&w=2574&auto=format&fit=crop', title: 'Temps d\'impact évangélique' },
  { id: 10, album: 'Culte et Adoration', src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2574&auto=format&fit=crop', title: 'Célébration festive' },
  { id: 11, album: 'Formation', src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2574&auto=format&fit=crop', title: 'Présentation de projets' },
  { id: 12, album: 'Communauté', src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2574&auto=format&fit=crop', title: 'Discussions enrichissantes' },
  { id: 13, album: 'Culte et Adoration', src: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2574&auto=format&fit=crop', title: 'Louange' },
  { id: 14, album: 'Evangélisation', src: 'https://images.unsplash.com/photo-1490578474895-699bc4e3f443?q=80&w=2574&auto=format&fit=crop', title: 'Rencontres de rue' },
  { id: 15, album: 'Communauté', src: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?q=80&w=2574&auto=format&fit=crop', title: 'Sortie d\'intégration' },
  { id: 16, album: 'Formation', src: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2574&auto=format&fit=crop', title: 'Salle de cours' },
  { id: 17, album: 'Culte et Adoration', src: 'https://images.unsplash.com/photo-1470229722913-7c090be5bb10?q=80&w=2574&auto=format&fit=crop', title: 'Choeur' },
  { id: 18, album: 'Evangélisation', src: 'https://images.unsplash.com/photo-1601509376690-3b47c0a96924?q=80&w=2574&auto=format&fit=crop', title: 'Evangélisation collective' },
]

export default function Galerie() {
  const [selectedAlbum, setSelectedAlbum] = useState('Tous')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // Lightbox state

  // Adapter la pagination au resize (Device Type)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(6) // Mobile: 6 images par page
      } else {
        setItemsPerPage(12) // Desktop/Tablette: 12 images par page
      }
    }

    handleResize() // Initialisation
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Remise à zéro de la pagination quand le filtre change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedAlbum])

  // Filtrage
  const filteredImages = MOCK_IMAGES.filter(img => 
    selectedAlbum === 'Tous' ? true : img.album === selectedAlbum
  )

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage)
  const currentImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
            Revivez les temps forts de l'Académie à travers nos archives visuelles.
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
                 value={selectedAlbum}
                 onChange={(e) => setSelectedAlbum(e.target.value)}
               >
                 {ALBUMS.map(album => (
                   <option key={album} value={album}>{album}</option>
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
              {ALBUMS.map(album => (
                <button
                  key={album}
                  onClick={() => setSelectedAlbum(album)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    selectedAlbum === album 
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {album}
                </button>
              ))}
            </div>
          </div>

          {/* Alert si vide */}
          {filteredImages.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
              <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune photo trouvée</h3>
              <p className="text-gray-500">Il n'y a pas encore d'images dans l'album "{selectedAlbum}".</p>
            </div>
          )}

          {/* Grille Flex/Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 min-h-[500px] content-start">
            {currentImages.map((img) => (
              <div 
                key={img.id} 
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 aspect-[4/3] cursor-pointer"
                onClick={() => setSelectedImage(img.src)}
              >
                <img 
                  src={img.src} 
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 p-6 flex flex-col justify-end">
                  <span className="text-brand-light text-xs font-bold uppercase tracking-widest mb-1 border-l-2 border-brand-orange pl-2">
                    {img.album}
                  </span>
                  <h3 className="text-white font-bold text-lg">
                    {img.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-14 mb-8 flex items-center justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Page précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-1.5 mx-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                        currentPage === page 
                          ? 'bg-brand-black text-white shadow-md' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Page suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md cursor-zoom-out animate-fade-in-up"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white p-3 bg-black/50 hover:bg-black/80 rounded-full transition-all"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Vue agrandie" 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </Layout>
  )
}
