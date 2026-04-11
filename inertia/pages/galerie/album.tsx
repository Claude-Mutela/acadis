import { useState, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '../../components/Layout'
import { ChevronLeft, ChevronRight, X, ArrowLeft, Grid3X3 } from 'lucide-react'
import { MOCK_ALBUMS, MOCK_IMAGES } from '../../utils/mock_galerie'

export default function GalerieAlbum({ slug }: { slug: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Trouver les données
  const album = MOCK_ALBUMS.find(a => a.slug === slug)
  const images = MOCK_IMAGES.filter(img => img.albumSlug === slug)

  // Adapter la pagination au resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(6)
      else setItemsPerPage(12)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(images.length / itemsPerPage)
  const currentImages = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (!album) {
    return (
      <Layout title="Album Introuvable — ACADIS">
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-center px-4">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Album Introuvable</h1>
          <p className="text-gray-500 mb-8">Cet album n'existe pas ou a été supprimé.</p>
          <Link href="/galerie" className="bg-brand-black text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-orange transition-colors">
            Retour à la galerie
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${album.title} — Galerie ACADIS`}>
      <Head title={`${album.title} — Galerie ACADIS`} />

      {/* Header compact spécifique à l'album */}
      <section className="bg-gray-50 pt-12 pb-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/galerie"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-brand-orange mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Retour aux albums
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                {album.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">{album.title}</h1>
              <p className="text-gray-500 mt-2 max-w-2xl">{album.description}</p>
            </div>
            <div className="text-sm font-bold text-gray-400 bg-white border border-gray-200 px-4 py-2 rounded-xl">
              {images.length} photos
            </div>
          </div>
        </div>
      </section>

      {/* Grille d'Images */}
      <section className="py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {images.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Album vide</h3>
              <p className="text-gray-500">Aucune photo n'est disponible pour le moment dans ce dossier.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 content-start">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-white font-bold text-lg border-l-2 border-brand-orange pl-2">
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
