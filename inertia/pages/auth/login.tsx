import { Head, Link, useForm } from '@inertiajs/react'
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <Head title="Connexion — ACADIS" />
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange rounded-full blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black rounded-full blur-[120px] opacity-10 -translate-x-1/2 translate-y-1/4 pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Retour à l'accueil</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-orange text-white rounded-2xl flex items-center justify-center font-black text-3xl shadow-lg shadow-orange/30">
            A
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-black">
          Bienvenue
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Connectez-vous à votre espace disciple
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-[440px] px-4 sm:px-0 relative z-10">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-2xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          <form className="space-y-6" onSubmit={submit}>
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
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
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
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
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
                  className="h-4 w-4 text-orange focus:ring-orange border-gray-300 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-medium cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-bold text-orange hover:text-black transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full mt-2 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-orange/20 text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-8">
            Pas encore de compte ?{' '}
            <Link href="/signup" className="font-bold text-orange hover:text-black transition-colors">
              S'inscrire ici
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
