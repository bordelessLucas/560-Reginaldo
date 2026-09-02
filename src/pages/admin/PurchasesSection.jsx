import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Card, { CardHeader } from '../../components/ui/Card'
import { PURCHASE_STATUS_LABELS, PURCHASE_STATUSES } from '../../constants/cashback'
import { COLLECTIONS } from '../../constants/collections'
import { useAuth } from '../../contexts/AuthContext'
import { useCollection } from '../../hooks/useFirestore'
import { generateCashbackForPurchase } from '../../services/cashback'
import { isClientEligibleForCashback } from '../../services/cashbackRules'
import { orderBy } from '../../services/firestore'
import { registerPurchase } from '../../services/purchases'
import { formatBRL, reaisToCents } from '../../utils/money'
import { ROUTES } from '../../utils/routes'
import { inputClassName } from '../../components/ui/inputStyles'

function todayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

export default function PurchasesSection() {
  const { user } = useAuth()
  const { data: clients, loading: loadingClients } = useCollection(COLLECTIONS.CLIENTS, [orderBy('name')])
  const { data: purchases, loading: loadingPurchases } = useCollection(COLLECTIONS.PURCHASES, [
    orderBy('createdAt', 'desc'),
  ])

  const [form, setForm] = useState({
    clientId: '',
    amountInput: '',
    invoiceNumber: '',
    purchaseDate: todayInputValue(),
  })
  const [saving, setSaving] = useState(false)
  const [generatingId, setGeneratingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [clientFilter, setClientFilter] = useState('')

  const clientsById = useMemo(() => {
    const map = new Map()
    clients.forEach((client) => map.set(client.id, client))
    return map
  }, [clients])

  const filteredClients = useMemo(() => {
    const term = clientFilter.trim().toLowerCase()
    if (!term) return clients
    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.cpf?.includes(term.replace(/\D/g, '')),
    )
  }, [clients, clientFilter])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const purchase = await registerPurchase({
        ...form,
        createdByUid: user?.uid,
        createdByName: user?.displayName || user?.email || '',
      })

      const client = clientsById.get(purchase.clientId)
      let message = `Compra registrada (NF ${purchase.invoiceNumber}).`

      if (isClientEligibleForCashback(client)) {
        try {
          const cashback = await generateCashbackForPurchase(purchase.id, {
            createdByUid: user?.uid,
            createdByName: user?.displayName || user?.email || '',
          })
          message += ` Cashback gerado: ${formatBRL(cashback.cashbackAmountCents)} (${cashback.percentApplied}%).`
        } catch (cashbackError) {
          message += ` Compra salva, mas o cashback não foi gerado: ${cashbackError.message}`
        }
      } else {
        message += ' Cliente sem cashback habilitado — benefício não gerado.'
      }

      setSuccess(message)
      setForm({
        clientId: '',
        amountInput: '',
        invoiceNumber: '',
        purchaseDate: todayInputValue(),
      })
      setClientFilter('')
    } catch (err) {
      setError(err.message || 'Não foi possível registrar a compra.')
    } finally {
      setSaving(false)
    }
  }

  async function handleGenerateCashback(purchaseId) {
    setGeneratingId(purchaseId)
    setError('')
    setSuccess('')

    try {
      const cashback = await generateCashbackForPurchase(purchaseId, {
        createdByUid: user?.uid,
        createdByName: user?.displayName || user?.email || '',
      })
      setSuccess(`Cashback gerado: ${formatBRL(cashback.cashbackAmountCents)} (${cashback.percentApplied}%).`)
    } catch (err) {
      setError(err.message || 'Não foi possível gerar o cashback.')
    } finally {
      setGeneratingId(null)
    }
  }

  const previewCents = reaisToCents(form.amountInput)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Registrar compra e nota fiscal"
          subtitle="A compra deve estar associada a um cliente existente. O cashback é calculado automaticamente quando o cliente estiver habilitado."
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-500">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm text-success-600">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="client-filter" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Localizar cliente
            </label>
            <input
              id="client-filter"
              type="search"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              placeholder="Buscar por nome, e-mail ou CPF..."
              className={inputClassName}
              disabled={loadingClients || saving}
            />
          </div>

          <div>
            <label htmlFor="clientId" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Cliente
            </label>
            <select
              id="clientId"
              required
              value={form.clientId}
              onChange={(e) => updateField('clientId', e.target.value)}
              className={inputClassName}
              disabled={loadingClients || saving}
            >
              <option value="">Selecione...</option>
              {filteredClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                  {isClientEligibleForCashback(client) ? ' · Cashback ativo' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="amountInput" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Valor da compra (R$)
              </label>
              <input
                id="amountInput"
                required
                value={form.amountInput}
                onChange={(e) => updateField('amountInput', e.target.value)}
                placeholder="0,00"
                className={inputClassName}
                disabled={saving}
              />
              {previewCents !== null && previewCents > 0 && (
                <p className="mt-1 text-xs text-slate-500">{formatBRL(previewCents)}</p>
              )}
            </div>

            <div>
              <label htmlFor="invoiceNumber" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nº da nota fiscal
              </label>
              <input
                id="invoiceNumber"
                required
                value={form.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                placeholder="Ex: 12345"
                className={inputClassName}
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="purchaseDate" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Data da compra
              </label>
              <input
                id="purchaseDate"
                type="date"
                required
                value={form.purchaseDate}
                onChange={(e) => updateField('purchaseDate', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Registrando...' : 'Confirmar registro'}
            </button>
          </div>
        </form>
      </Card>

      <Card padding={false}>
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Compras registradas</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Histórico de compras e notas fiscais.</p>
        </div>

        {loadingPurchases && (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
          </div>
        )}

        {!loadingPurchases && purchases.length === 0 && (
          <div className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            Nenhuma compra registrada.
          </div>
        )}

        {!loadingPurchases && purchases.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-dark-card/50">
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Cliente</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">NF</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Data</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Valor</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {purchases.map((purchase) => {
                  const client = clientsById.get(purchase.clientId)
                  const canGenerate =
                    purchase.status === PURCHASE_STATUSES.REGISTERED &&
                    !purchase.cashbackId &&
                    isClientEligibleForCashback(client)

                  return (
                    <tr key={purchase.id} className="hover:bg-slate-50/60 dark:hover:bg-dark-card/40">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{purchase.clientName}</p>
                        <Link
                          to={ROUTES.ADMIN_CLIENT_EDIT.replace(':id', purchase.clientId)}
                          className="text-xs text-brand-600 hover:text-brand-700"
                        >
                          Ver cliente
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{purchase.invoiceNumber}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{purchase.purchaseDate}</td>
                      <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">
                        {formatBRL(purchase.amountCents)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={
                            purchase.status === PURCHASE_STATUSES.CASHBACK_GENERATED ? 'success' : 'default'
                          }
                        >
                          {PURCHASE_STATUS_LABELS[purchase.status] || purchase.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {canGenerate && (
                          <button
                            type="button"
                            disabled={generatingId === purchase.id}
                            onClick={() => handleGenerateCashback(purchase.id)}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 disabled:opacity-60 dark:hover:bg-brand-500/10"
                          >
                            {generatingId === purchase.id ? 'Gerando...' : 'Gerar cashback'}
                          </button>
                        )}
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
