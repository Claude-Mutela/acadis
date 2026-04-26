import { Link, usePage } from '@inertiajs/react'
import { 
  Compass, User, Bell, LogOut, GraduationCap, ChevronDown
} from 'lucide-react'
import { useState } from 'react'

interface StudentLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function StudentLayout({ children, title }: StudentLayoutProps) {
  const { url, props } = usePage<any>()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    { label: 'Mon Apprentissage', icon: GraduationCap, href: '/etudiant/dashboard' },
    { label: 'Catalogue', icon: Compass, href: '/etudiant/catalogue' },
    { label: 'Mon Profil', icon: User, href: '/etudiant/profil' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Light Theme for Students) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo ACADIS.png" 
              alt="Logo ACADIS" 
              className="h-10 w-auto transform group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="text-gray-900 font-black text-lg leading-tight tracking-tight">Espace</span>
              <span className="text-gray-500 font-bold text-xs uppercase tracking-widest leading-none">Étudiant</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = url.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-orange/10 text-orange' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange transition-colors">
            <LogOut className="w-4 h-4" /> Retour au site web
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex-1 flex items-center">
             <h2 className="text-xl font-black text-gray-800">{title || 'Tableau de bord'}</h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-orange transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-50 rounded-full transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-orange/10 text-orange font-black flex items-center justify-center">
                  {props.user?.initials}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{props.user?.fullName}</p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{props.user?.role === 'student' ? 'Apprenant' : props.user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-100 py-2 z-50 animate-fade-in-up">
                  <Link href="/etudiant/profil" className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">Mon profil complet</Link>
                  <hr className="my-2 border-gray-100" />
                  <Link href="/logout" method="post" as="button" className="w-full text-left block px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
