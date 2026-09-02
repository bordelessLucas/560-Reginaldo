import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CashbackRulesPanel from '../../components/admin/CashbackRulesPanel'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import { COLLECTIONS } from '../../constants/collections'
import { useCollection } from '../../hooks/useFirestore'
import { getCashbackDisplayStatus } from '../../utils/clientCashbackStatus'
import { ROUTES } from '../../utils/routes'
import { inputClassName } from '../../components/ui/inputStyles'
import { orderBy } from '../../services/firestore'

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'Cashback ativo' },
  { id: 'inactive', label: 'Cashback inativo' },
  { id: 'not-participant', label: 'Não participante' },
]

function matchesFilter(client, filter) {
  const { participatesInProgram, cashbackEnabled } = client.aceleraClube || {}

  if (filter === 'active') return participatesInProgram && cashbackEnabled
  if (filter === 'inactive') return participatesInProgram && !cashbackEnabled
  if (filter === 'not-participant') return !participatesInProgram
  return true
}

export default function CashbackSection() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const { data: clients, loading, error } = useCollection(COLLECTIONS.CLIENTS, [orderBy('name')])

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase()

    return clients.filter((client) => {
      if (!matchesFilter(client, filter)) return false
      if (!term) return true
      return client.name?.toLowerCase().includes(term) || client.email?.toLowerCase().includes(term)
    })
  }, [clients, filter, search])

  return (
    <div className="space-y-6">
      <CashbackRulesPanel />

      <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Situação do cashback e participação no Acelera Clube por cliente.
      </p>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === item.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-dark-card dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="w-full lg:max-w-xs">
          <label htmlFor="cashback-search" className="sr-only">
            Buscar cliente
          </label>
          <input
            id="cashback-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className={inputClassName}
          />
        </div>
      </div>

      <Card padding={false}>
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
          </div>
        )}

        {!loading && error && (
          <div className="p-6 text-sm text-danger-500">Não foi possível carregar os dados de cashback.</div>
        )}

        {!loading && !error && filteredClients.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum cliente encontrado para este filtro.</p>
          </div>
        )}

        {!loading && !error && filteredClients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-dark-card/50">
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Cliente</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Participação</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Cashback</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredClients.map((client) => {
                  const status = getCashbackDisplayStatus(client.aceleraClube)
                  const participates = Boolean(client.aceleraClube?.participatesInProgram)
                  const cashbackOn = Boolean(client.aceleraClube?.cashbackEnabled)

                  return (
                    <tr key={client.id} className="hover:bg-slate-50/60 dark:hover:bg-dark-card/40">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{client.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{client.email || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={participates ? 'brand' : 'default'}>
                          {participates ? 'Participante' : 'Não participante'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={cashbackOn ? 'success' : 'warning'}>
                          {cashbackOn ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={ROUTES.ADMIN_CLIENT_EDIT.replace(':id', client.id)}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10"
                        >
                          Configurar
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      </div>
    </div>
  )
}
