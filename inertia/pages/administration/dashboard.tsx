import { Head } from '@inertiajs/react'
import AdminLayout from '../../components/administration/AdminLayout'
import { Users, GraduationCap, BookOpen, CreditCard, ArrowUpRight } from 'lucide-react'

// Dummy data
const stats = [
  { name: 'Total Étudiants', value: '248', icon: Users, change: '+12%', color: 'bg-blue-600', badge: 'bg-blue-50 text-blue-600' },
  { name: 'Formateurs Actifs', value: '16', icon: GraduationCap, change: '+2', color: 'bg-indigo-600', badge: 'bg-indigo-50 text-indigo-600' },
  { name: 'Programmes', value: '8', icon: BookOpen, change: 'Stable', color: 'bg-green-600', badge: 'bg-green-50 text-green-600' },
  { name: 'Paiements du mois', value: '$4,250', icon: CreditCard, change: '+8%', color: 'bg-orange', badge: 'bg-orange/10 text-orange' },
]

export default function Dashboard() {
  return (
    <AdminLayout title="Dashboard Administration">
      <Head title="Dashboard — Admin ACADIS" />
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-500 mt-1">Gérez l'académie depuis cet espace centralisé.</p>
        </div>
        <button className="bg-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-orange/20 transition-all hover:-translate-y-0.5">
          Télécharger le rapport
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 flex flex-col transition-all hover:shadow-md hover:border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-inner ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-lg ${stat.badge}`}>
                {stat.change}
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-3xl font-black text-gray-900 mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Inscriptions d'Étudiants</h3>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-orange focus:border-orange block p-2 font-medium">
              <option>Cette année</option>
              <option>L'année dernière</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-medium">
            (Intégration Graphique Line/Bar ici)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Derniers Inscrits</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold shadow-sm">
                  A{i}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">Alexi Ntambwe {i}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">Parcours Fondamental</p>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  Auj
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-sm font-bold text-orange bg-orange/10 hover:bg-orange hover:text-white rounded-xl transition-colors">
            Voir tous les étudiants
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
