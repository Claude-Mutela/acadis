import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { Mail, Lock, LogIn, ArrowLeft, AlertCircle } from 'lucide-react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const { props } = usePage<any>()
  const flashError: string | undefined = props.flash?.error

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Head title="Connexion — ACADIS" />

      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12 relative">
        {/* Back Link */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour à l'accueil</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mb-10 animate-fade-in-up text-center">
             <Link href="/" className="inline-block">
               <img src="/logo ACADIS.png" alt="Logo ACADIS" className="h-14 w-auto mx-auto mb-8 hover:scale-105 transition-transform" />
             </Link>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              Bon retour !
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Connectez-vous à votre espace disciple pour continuer votre formation.
            </p>
          </div>

          <form className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }} onSubmit={submit}>
            {flashError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium animate-fade-in-up">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{flashError}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              {errors.email && <div className="text-red-500 text-xs mt-1 font-medium">{errors.email}</div>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1 font-medium">{errors.password}</div>}
            </div>

           

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={data.remember}
                  onChange={e => setData('remember', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-light cursor-pointer transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-medium cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-bold text-brand-orange hover:text-brand-dark transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full mt-4 flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-orange/20 text-sm font-black text-white bg-brand-black hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Pas encore de compte ?{' '}
            <Link href="/signup" className="font-bold text-brand-orange hover:text-brand-dark transition-colors">
              S'inscrire ici
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Image showcase */}
      <div className="hidden lg:block relative w-0 flex-1 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay hover:scale-105 transition-transform duration-[20s] ease-out"
          src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop"
          alt="Étudiants en formation"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-16 z-20">
          <blockquote className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-4xl xl:text-5xl font-black text-white leading-tight">
              "Former les disciples pour bâtir une église mature."
            </p>
            <footer className="flex items-center gap-4">
              <div className="w-12 h-1.5 bg-brand-orange rounded-full" />
              <span className="text-brand-wheat font-bold tracking-widest uppercase text-sm">
                La vision ACADIS
              </span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
