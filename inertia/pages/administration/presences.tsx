import AdminLayout from '../../components/administration/AdminLayout'
import { Head } from '@inertiajs/react'
import { CalendarCheck } from 'lucide-react'

export default function Presences() {
  return (
    <AdminLayout title="Gestion des Présences">
      <Head title="Présences — Administration" />
      
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm animate-fade-in-up">
        <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarCheck className="w-10 h-10 text-brand-orange" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Gestion des Présences</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-lg">
          Cette section est en cours de développement. Elle permettra bientôt aux superviseurs de marquer les présences des étudiants pour chaque session.
        </p>
      </div>
    </AdminLayout>
  )
}
