import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import { COLLECTIONS } from '../../constants/collections'
import { useCollection } from '../../hooks/useFirestore'
import { formatCpf, formatPhone } from '../../utils/masks'
import { getCashbackDisplayStatus } from '../../utils/clientCashbackStatus'
import { ROUTES } from '../../utils/routes'
import { inputClassName } from '../../components/ui/inputStyles'
import { orderBy } from '../../services/firestore'

export default function ClientsSection() {
  const [search, setSearch] = useState('')
  const { data: clients, loading, error } = useCollection(COLLECTIONS.CLIENTS, [orderBy('name')])

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return clients

    return clients.filter((client) => {
      const cpf = client.cpf || ''
      const phone = client.phone || ''
      return (
        client.name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        cpf.includes(term.replace(/\D/g, '')) ||
        phone.includes(term.replace(/\D/g, ''))
      )
    })
  }, [clients, search])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Consulta e edição de clientes cadastrados no Acelera Clube.
        </p>

        <div className="w-full sm:max-w-xs">
          <label htmlFor="client-search" className="sr-only">
            Buscar cliente
          </label>
          <input
            id="client-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail, CPF..."
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
          <div className="p-6 text-sm text-danger-500">Não foi possível carregar os clientes.</div>
        )}

        {!loading && !error && filteredClients.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {search ? 'Nenhum cliente encontrado para esta busca.' : 'Nenhum cliente cadastrado.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredClients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-dark-card/50">
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Nome</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">E-mail</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">CPF</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Telefone</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Cashback</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredClients.map((client) => {
                  const status = getCashbackDisplayStatus(client.aceleraClube)

                  return (
                    <tr key={client.id} className="hover:bg-slate-50/60 dark:hover:bg-dark-card/40">
                      <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">{client.name}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{client.email || '—'}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {client.cpf ? formatCpf(client.cpf) : '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {client.phone ? formatPhone(client.phone) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={ROUTES.ADMIN_CLIENT_EDIT.replace(':id', client.id)}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10"
                        >
                          Editar
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
  )
}
