import { useMemo } from 'react'
import Badge from '../ui/Badge'
import Card, { CardHeader } from '../ui/Card'
import { CASHBACK_STATUS_LABELS } from '../../constants/cashback'
import { COLLECTIONS } from '../../constants/collections'
import { useCollection } from '../../hooks/useFirestore'
import { orderBy, where } from '../../services/firestore'
import { formatBRL, formatPercent } from '../../utils/money'

export default function ClientCashbackHistory({ clientId }) {
  const constraints = useMemo(
    () => [where('clientId', '==', clientId), orderBy('createdAt', 'desc')],
    [clientId],
  )
  const { data: entries, loading, error } = useCollection(COLLECTIONS.CASHBACK, constraints)

  const totalGeneratedCents = useMemo(
    () => entries.reduce((sum, item) => sum + (Number(item.cashbackAmountCents) || 0), 0),
    [entries],
  )

  return (
    <Card>
      <CardHeader
        title="Resumo do Cashback"
        subtitle="Histórico de benefícios gerados a partir das compras deste cliente."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-dark-card/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total gerado</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {loading ? '—' : formatBRL(totalGeneratedCents)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-dark-card/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">Registros</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {loading ? '—' : entries.length}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
        </div>
      )}

      {error && (
        <p className="text-sm text-danger-500">Não foi possível carregar o histórico de cashback.</p>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum cashback gerado para este cliente.</p>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Histórico</h4>
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
            {entries.map((entry) => (
              <li key={entry.id} className="px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Compra · NF {entry.invoiceNumber || '—'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Valor: {formatBRL(entry.purchaseAmountCents)} ·{' '}
                      {formatPercent(entry.percentApplied)} · Cashback:{' '}
                      <strong className="text-slate-700 dark:text-slate-200">
                        {formatBRL(entry.cashbackAmountCents)}
                      </strong>
                    </p>
                  </div>
                  <Badge variant={entry.status === 'cancelled' ? 'danger' : 'success'}>
                    {CASHBACK_STATUS_LABELS[entry.status] || entry.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
