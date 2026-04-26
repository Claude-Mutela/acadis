import { Head, Link, useForm } from '@inertiajs/react'
import { Mail, Lock, UserPlus, ArrowLeft, User } from 'lucide-react'

export default function Signup() {
  const { data, setData, post, processing, errors } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: '',
    agreeTerms: false,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/signup')
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Head title="Inscription — ACADIS" />
      
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12 relative">
        {/* Back Link */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour à l'accueil</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-md py-6">
          <div className="mb-6 animate-fade-in-up text-center">
            <Link href="/" className="inline-block">
              <img src="/logo ACADIS.png" alt="Logo ACADIS" className="h-10 w-auto mx-auto mb-4 hover:scale-105 transition-transform" />
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Créer un compte
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              Rejoignez l'académie et commencez votre formation dès aujourd'hui.
            </p>
          </div>

          <form className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }} onSubmit={submit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={data.firstName}
                    onChange={e => setData('firstName', e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                    placeholder="Jean"
                    required
                  />
                </div>
                {errors.firstName && <div className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</div>}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={data.lastName}
                    onChange={e => setData('lastName', e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white"
                    placeholder="Dupont"
                    required
                  />
                </div>
                {errors.lastName && <div className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</div>}
              </div>
            </div>

            {/* Email */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.password && <div className="text-red-500 text-xs mt-1 font-medium">{errors.password}</div>}
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Confirmation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100/50 focus:bg-white text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.password_confirmation && <div className="text-red-500 text-xs mt-1 font-medium">{errors.password_confirmation}</div>}
              </div>
            </div>

            {/* Conditions Générales */}
            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  checked={data.agreeTerms}
                  onChange={e => setData('agreeTerms', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-light cursor-pointer transition-colors"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="font-medium text-gray-600 cursor-pointer">
                  J'accepte les <Link href="#" className="text-brand-orange hover:text-brand-dark font-bold">conditions d'utilisation</Link> et la charte de l'académie.
                </label>
              </div>
              {errors.agreeTerms && <div className="text-red-500 text-xs mt-1 font-medium">{errors.agreeTerms}</div>}
            </div>

            {/* Bouton Soumettre */}
            <button
              type="submit"
              disabled={processing}
              className="w-full mt-4 flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-orange/20 text-sm font-black text-white bg-brand-black hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-bold text-brand-orange hover:text-brand-dark transition-colors">
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Image showcase */}
      <div className="hidden lg:block relative w-0 flex-1 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay hover:scale-105 transition-transform duration-[20s] ease-out"
          src="https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=2574&auto=format&fit=crop"
          alt="Livre ouvert et connaissances"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-16 z-20">
          <blockquote className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-4xl xl:text-5xl font-black text-white leading-tight">
              "La moisson est grande, mais les ouvriers qualifiés sont rares."
            </p>
            <footer className="flex items-center gap-4">
              <div className="w-12 h-1.5 bg-brand-orange rounded-full" />
              <span className="text-brand-wheat font-bold tracking-widest uppercase text-sm">
                La mission ACADIS
              </span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
