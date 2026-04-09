import { Link, usePage } from '@inertiajs/react'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  CalendarDays,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Landmark
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/administration/dashboard', icon: LayoutDashboard },
  { name: 'Étudiants', href: '/administration/etudiants', icon: Users },
  { name: 'Ministères', href: '/administration/ministeres', icon: Landmark },
  { name: 'Formateurs', href: '/administration/formateurs', icon: GraduationCap },
  { name: 'Programmes', href: '/administration/programmes', icon: BookOpen },
  { name: 'Paiements', href: '/administration/paiements', icon: CreditCard },
  { name: 'Planning', href: '/administration/planning', icon: CalendarDays },
]

export default function AdminLayout({ children, title = 'Administration' }: { children: React.ReactNode, title?: string }) {
  const { url } = usePage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 flex flex-col shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center px-4 bg-gray-950/50 border-b border-gray-800">
          <img 
            src="/logo ACADIS.png" 
            alt="Logo ACADIS" 
            className="h-10 w-auto mr-3 brightness-0 invert opacity-90" 
          />
          <span className="font-black text-lg tracking-wider text-white">Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = url.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-orange text-white shadow-md shadow-orange/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-gray-800">
           <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-white transition-colors">
              Retour au site web
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 flex-shrink-0">
          <div className="flex items-center flex-1">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center bg-gray-100 rounded-xl px-4 py-2.5 text-sm w-96 border border-gray-200 focus-within:border-orange focus-within:ring-1 focus-within:ring-orange transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Rechercher (étudiant, paiement...)" 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-l border-gray-100 pl-4 sm:pl-6 ml-4 sm:ml-6">
            <button className="relative text-gray-400 hover:text-orange transition-colors p-2 rounded-full hover:bg-orange/10">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 py-1.5 px-3 rounded-xl transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  JD
                </div>
                <div className="hidden md:block text-sm text-left">
                  <p className="font-bold text-gray-900 leading-tight">Jean Dupont</p>
                  <p className="text-gray-500 text-xs">Directeur Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block ml-1" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-100 py-2 z-50 animate-fade-in-up">
                  <Link href="/administration/profil" className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">Mon profil complet</Link>
                  <hr className="my-2 border-gray-100" />
                  <Link href="/logout" className="block px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Déconnexion</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
