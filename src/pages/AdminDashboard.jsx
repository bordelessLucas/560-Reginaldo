import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ADMIN_SECTIONS, getAdminDashboardPath } from '../constants/adminSections'
import Icon from '../components/ui/Icon'
import Card from '../components/ui/Card'
import CashbackSection from './admin/CashbackSection'
import ClientEditPage from './admin/ClientEditPage'
import ClientsSection from './admin/ClientsSection'

const TABS = [
  { id: ADMIN_SECTIONS.OVERVIEW, label: 'Visão geral', icon: 'dashboard' },
  { id: ADMIN_SECTIONS.CLIENTS, label: 'Clientes', icon: 'users' },
  { id: ADMIN_SECTIONS.CASHBACK, label: 'Cashback', icon: 'cashback' },
]

function OverviewSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link to={getAdminDashboardPath(ADMIN_SECTIONS.CLIENTS)}>
        <Card className="transition-colors hover:border-brand-300 hover:bg-brand-50/30 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
              <Icon name="users" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Clientes</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Consultar e editar dados cadastrais dos participantes.
              </p>
            </div>
          </div>
        </Card>
      </Link>

      <Link to={getAdminDashboardPath(ADMIN_SECTIONS.CASHBACK)}>
        <Card className="transition-colors hover:border-brand-300 hover:bg-brand-50/30 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
              <Icon name="cashback" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Cashback</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Verificar situação do cashback e participação no programa.
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  )
}

function AdminTabs({ activeSection, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeSection === tab.id
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-dark-card dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <Icon name={tab.icon} className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeSection = searchParams.get('secao') || ADMIN_SECTIONS.OVERVIEW

  function handleTabChange(section) {
    if (section === ADMIN_SECTIONS.OVERVIEW) {
      setSearchParams({})
      return
    }

    setSearchParams({ secao: section })
  }

  if (id) {
    return <ClientEditPage />
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Painel administrativo do Acelera Clube.
        </p>
      </div>

      <AdminTabs activeSection={activeSection} onChange={handleTabChange} />

      {activeSection === ADMIN_SECTIONS.OVERVIEW && <OverviewSection />}
      {activeSection === ADMIN_SECTIONS.CLIENTS && <ClientsSection />}
      {activeSection === ADMIN_SECTIONS.CASHBACK && <CashbackSection />}
    </div>
  )
}
