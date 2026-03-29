import { Head, Link } from '@inertiajs/react'
import Layout from '../components/Layout'
import { Clock, Banknote, CheckCircle2, Check, Lightbulb } from 'lucide-react'

// ── Data Mockée ───────────────────────────────────────────────────────────────
// En production, ces données viendraient du backend via les props.
const programmeData = {
  id: 1,
  titre: 'Leadership Biblique Avancé',
  categorie: 'Leadership',
  duree: '9 mois',
  prix: '150$',
  niveau: 'Avancé',
  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop',
  descriptionLongue: `Le programme de Leadership Biblique Avancé est conçu pour forger le caractère et aiguiser les compétences de ceux qui sont appelés à diriger dans l'œuvre du Seigneur. À travers un parcours intensif de 9 mois, vous serez confronté aux exigences du leadership selon les standards du Royaume de Dieu, loin des modèles séculiers de management.

Nous croyons fermement qu'un leader spirituel doit d'abord être un serviteur (Doulos) ayant développé une intimité profonde avec Dieu. Ce cursus met l'accent sur l'intégrité morale, la gestion des conflits, l'empathie pastorale et la direction par l'Esprit.`,
  
  objectifs: [
    'Comprendre la différence entre le leadership mondain et le leadership spirituel.',
    'Développer un caractère éprouvé, capable de résister aux pressions du ministère.',
    'Apprendre à identifier, former et déléguer à d’autres leaders potentiels.',
    'Gérer efficacement les ressources humaines et financières d’un département ou d’une église.'
  ],

  modules: [
    {
      titre: 'Le Cœur du Leader',
      description: 'Gérer son ego, ses blessures et cultiver l\'humilité. Étude de cas : Moïse et David.',
      heures: '24h'
    },
    {
      titre: 'Principes de Gouvernance',
      description: 'Administration d\'une église locale, éthique pastorale et gestion des finances selon la Bible.',
      heures: '36h'
    },
    {
      titre: 'Communication et Prédication',
      description: 'Homilétique pratique, comment transmettre la vision clairement et mobiliser les foules.',
      heures: '30h'
    },
    {
      titre: 'Gestion de Crise et Conflits',
      description: 'Comment réagir face aux divisions, à la rébellion et aux scandales avec sagesse et fermeté.',
      heures: '18h'
    }
  ],

  debouches: [
    'Ancien ou Diacre au sein d\'une église locale',
    'Responsable de département (Jeunesse, Louange, Intercession)',
    'Implantation de nouvelles cellules ou églises',
    'Coordination d\'œuvres missionnaires'
  ]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProgrammeDetail({ id }: { id?: string }) {
  // Ici, on utiliserait le `id` pour chercher la bonne donnée.
  // Pour l'instant, on utilise data mockée.
  const prog = programmeData

  return (
    <Layout title={`${prog.titre} — ACADIS`}>
      
      {/* ════════════════════════════════════════════════════════
          1. HEADER (HERO)
      ════════════════════════════════════════════════════════ */}
      <section className="relative bg-black text-white pt-32 pb-24 overflow-hidden min-h-[60vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={prog.image} 
            alt={prog.titre} 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="animate-fade-in-up">
            
            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-orange text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                {prog.categorie}
              </span>
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {prog.duree}
              </span>
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5" />
                Frais: {prog.prix}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              {prog.titre}
            </h1>

            {/* CTA in Hero */}
            <div className="flex items-center gap-4 mt-10">
              <Link 
                href="/contact" 
                className="bg-orange hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-orange/20 hover:-translate-y-0.5"
              >
                S'inscrire à ce programme
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* 2. DESCRIPTION COMPLÈTE */}
              <div>
                <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-orange rounded-full inline-block"></span>
                  Présentation
                </h2>
                <div className="prose prose-lg text-gray-600 leading-relaxed font-medium">
                  {prog.descriptionLongue.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-black mb-4">Objectifs visés :</h3>
                  <ul className="space-y-3">
                    {prog.objectifs.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <CheckCircle2 className="w-6 h-6 text-orange flex-shrink-0" />
                        <span className="mt-0.5">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3. MODULES */}
              <div>
                <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-orange rounded-full inline-block"></span>
                  Structure des Modules
                </h2>
                
                <div className="space-y-4">
                  {prog.modules.map((mod, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-lg font-bold text-black group-hover:text-orange transition-colors">
                          <span className="text-gray-300 mr-2">{(i + 1).toString().padStart(2, '0')}.</span>
                          {mod.titre}
                        </h3>
                        <span className="bg-gray-50 text-gray-500 text-xs font-bold px-2 py-1 rounded border border-gray-100 flex-shrink-0">
                          {mod.heures}
                        </span>
                      </div>
                      <p className="text-gray-500 ml-8 text-sm leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                
                {/* 4. DÉBOUCHÉS */}
                <div className="bg-black text-white p-8 rounded-3xl shadow-xl">
                  <h3 className="text-xl font-bold mb-6">Débouchés & Profil de sortie</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    À l'issue de cette formation, l'étudiant sera qualifié pour œuvrer efficacement dans les contextes suivants :
                  </p>
                  <ul className="space-y-4">
                    {prog.debouches.map((deb, i) => (
                      <li key={i} className="flex gap-3 text-sm font-medium">
                        <div className="w-5 h-5 bg-white/10 text-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className="text-gray-200">{deb}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Info block */}
                <div className="bg-orange/10 border border-orange/20 p-6 rounded-3xl text-center">
                  <div className="w-12 h-12 bg-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange/30">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-black mb-2">Besoin d'aide ?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Si vous n'êtes pas sûr que ce programme soit fait pour vous, n'hésitez pas à nous contacter pour un entretien d'orientation.
                  </p>
                  <Link href="/contact" className="text-orange font-bold text-sm hover:underline">
                    Nous contacter &rarr;
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. CTA BOTTOM
      ════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 border-t border-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-black mb-4">Prêt à développer votre appel ?</h2>
          <p className="text-gray-500 text-lg mb-8">
            Rejoignez la prochaine session du programme <span className="font-bold text-black">{prog.titre}</span> et transformez votre trajectoire spirituelle.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl hover:-translate-y-1 text-lg"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </section>

    </Layout>
  )
}
