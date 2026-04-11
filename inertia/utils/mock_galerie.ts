// ── MOCK DATA FOR GALLERY ALBUMS ─────────────────────────────────────────────────────────────

export const MOCK_ALBUMS = [
  { 
    id: 1, 
    slug: 'formation', 
    title: 'Cours & Formations', 
    category: 'Académique', 
    coverSrc: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop', 
    description: 'Aperçu de nos salles de classes et temps de formation doctrinale et biblique.',
    imageCount: 5 
  },
  { 
    id: 2, 
    slug: 'culte-adoration', 
    title: 'Culte & Adoration', 
    category: 'Spirituel', 
    coverSrc: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=2574&auto=format&fit=crop', 
    description: 'Moments intenses d\'adoration pendant nos cultes dominicaux et grandes retraites.',
    imageCount: 5 
  },
  { 
    id: 3, 
    slug: 'communaute', 
    title: 'Vie en Communauté', 
    category: 'Fraternel', 
    coverSrc: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2574&auto=format&fit=crop', 
    description: 'Partages, agapes et sorties symbolisant l\'unité de l\'église locale.',
    imageCount: 4 
  },
  { 
    id: 4, 
    slug: 'evangelisation', 
    title: 'Mission & Évangélisation', 
    category: 'Mission', 
    coverSrc: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2574&auto=format&fit=crop', 
    description: 'Campagnes d\'évangélisation en plein air et actions sociales dans la ville.',
    imageCount: 4 
  },
]

export const ALBUM_CATEGORIES = ['Tous', 'Académique', 'Spirituel', 'Fraternel', 'Mission']

export const MOCK_IMAGES = [
  // Formation
  { id: 1, albumSlug: 'formation', src: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop', title: 'Cours d\'herméneutique' },
  { id: 4, albumSlug: 'formation', src: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=2574&auto=format&fit=crop', title: 'Étude biblique personelle' },
  { id: 7, albumSlug: 'formation', src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2574&auto=format&fit=crop', title: 'Travail de groupe' },
  { id: 11, albumSlug: 'formation', src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2574&auto=format&fit=crop', title: 'Présentation de projets' },
  { id: 16, albumSlug: 'formation', src: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2574&auto=format&fit=crop', title: 'Salle de cours' },

  // Culte
  { id: 2, albumSlug: 'culte-adoration', src: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=2574&auto=format&fit=crop', title: 'Adoration dominicale' },
  { id: 6, albumSlug: 'culte-adoration', src: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2574&auto=format&fit=crop', title: 'Moment de prière' },
  { id: 10, albumSlug: 'culte-adoration', src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2574&auto=format&fit=crop', title: 'Célébration festive' },
  { id: 13, albumSlug: 'culte-adoration', src: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2574&auto=format&fit=crop', title: 'Louange' },
  { id: 17, albumSlug: 'culte-adoration', src: 'https://images.unsplash.com/photo-1470229722913-7c090be5bb10?q=80&w=2574&auto=format&fit=crop', title: 'Choeur' },

  // Communaute
  { id: 3, albumSlug: 'communaute', src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2574&auto=format&fit=crop', title: 'Partage en groupe' },
  { id: 8, albumSlug: 'communaute', src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2574&auto=format&fit=crop', title: 'Repas fraternel' },
  { id: 12, albumSlug: 'communaute', src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2574&auto=format&fit=crop', title: 'Discussions enrichissantes' },
  { id: 15, albumSlug: 'communaute', src: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?q=80&w=2574&auto=format&fit=crop', title: 'Sortie d\'intégration' },

  // Evangelisation
  { id: 5, albumSlug: 'evangelisation', src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2574&auto=format&fit=crop', title: 'Mission locale' },
  { id: 9, albumSlug: 'evangelisation', src: 'https://images.unsplash.com/photo-1526976663112-0015bdcbfc6f?q=80&w=2574&auto=format&fit=crop', title: 'Temps d\'impact évangélique' },
  { id: 14, albumSlug: 'evangelisation', src: 'https://images.unsplash.com/photo-1490578474895-699bc4e3f443?q=80&w=2574&auto=format&fit=crop', title: 'Rencontres de rue' },
  { id: 18, albumSlug: 'evangelisation', src: 'https://images.unsplash.com/photo-1601509376690-3b47c0a96924?q=80&w=2574&auto=format&fit=crop', title: 'Evangélisation collective' },
]
