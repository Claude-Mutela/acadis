import { Head, Link } from '@inertiajs/react'
import Layout from '../components/Layout'
import { Clock, Banknote, CheckCircle2, Check, Lightbulb } from 'lucide-react'

// ── Data Mockée ───────────────────────────────────────────────────────────────
// En production, ces données viendraient du backend via les props.
export interface Module {
  id: number
  title: string
  description: string
  order: number
}

export interface Manuel {
  id: number
  title: string
  price: number
}

export interface Program {
  id: number
  name: string
  slug: string
  description: string
  presentation: string
  duration: string
  coverImage: string | null
  objectives: string | string[]
  outputProfile: string | string[]
  categoryId: number | null
  category?: {
    id: number
    name: string
  }
  modules?: Module[]
  manuels?: Manuel[]
}

interface Props {
  program: Program
}

export default function ProgrammeDetail({ program }: Props) {
  // Helper to parse JSON if string
  const parseData = (data: any): string[] => {
    if (Array.isArray(data)) return data
    if (typeof data === 'string') {
      try {
        return JSON.parse(data)
      } catch (e) {
        return [data]
      }
    }
    return []
  }

  const objectives = parseData(program.objectives)
  const outputProfile = parseData(program.outputProfile)
  const modules = program.modules || []
  const manuels = program.manuels || []

  const totalFee = manuels.reduce((acc, m) => acc + (m.price || 0), 0)
  const feeDisplay = totalFee > 0 ? `${totalFee}$` : 'Gratuit'

  return (
    <Layout title={`${program.name} — ACADIS`}>
      
      {/* ════════════════════════════════════════════════════════
          1. HEADER (HERO)
      ════════════════════════════════════════════════════════ */}
      <section className="relative bg-black text-white pt-32 pb-24 overflow-hidden min-h-[60vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {program.coverImage ? (
            <img 
              src={program.coverImage} 
              alt={program.name} 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="animate-fade-in-up">
            
            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-orange text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                {program.category?.name || 'Général'}
              </span>
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {program.duration}
              </span>
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5" />
                Frais Manuels : {feeDisplay}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              {program.name}
            </h1>

            {/* CTA in Hero */}
            <div className="flex items-center gap-4 mt-10">
              <Link 
                href="/signup" 
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
                  {program.presentation?.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  )) || <p>{program.description}</p>}
                </div>

                {objectives.length > 0 && (
                  <div className="mt-8 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-black mb-4">Objectifs visés :</h3>
                    <ul className="space-y-3">
                      {objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600">
                          <CheckCircle2 className="w-6 h-6 text-orange flex-shrink-0" />
                          <span className="mt-0.5">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 3. MODULES */}
              {modules.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-2">
                    <span className="w-8 h-1 bg-orange rounded-full inline-block"></span>
                    Structure des Modules
                  </h2>
                  
                  <div className="space-y-4">
                    {modules.map((mod, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3 className="text-lg font-bold text-black group-hover:text-orange transition-colors">
                            <span className="text-gray-300 mr-2">{(i + 1).toString().padStart(2, '0')}.</span>
                            {mod.title}
                          </h3>
                        </div>
                        <p className="text-gray-500 ml-8 text-sm leading-relaxed">
                          {mod.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                
                {/* 4. DÉBOUCHÉS */}
                {outputProfile.length > 0 && (
                  <div className="bg-black text-white p-8 rounded-3xl shadow-xl">
                    <h3 className="text-xl font-bold mb-6">Débouchés & Profil de sortie</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      À l'issue de cette formation, l'étudiant sera qualifié pour œuvrer efficacement dans les contextes suivants :
                    </p>
                    <ul className="space-y-4">
                      {outputProfile.map((deb, i) => (
                        <li key={i} className="flex gap-3 text-sm font-medium">
                          <div className="w-5 h-5 bg-white/10 text-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          <span className="text-gray-200">{deb}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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

      {/* 5. CTA BOTTOM */}
      <section className="bg-white py-20 border-t border-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-black mb-4">Prêt à développer votre appel ?</h2>
          <p className="text-gray-500 text-lg mb-8">
            Rejoignez la prochaine session du programme <span className="font-bold text-black">{program.name}</span> et transformez votre trajectoire spirituelle.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl hover:-translate-y-1 text-lg"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </section>

    </Layout>
  )
}
