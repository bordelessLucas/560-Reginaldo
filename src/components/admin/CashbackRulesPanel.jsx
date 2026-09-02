import { useEffect, useState } from 'react'
import Badge from '../ui/Badge'
import Card, { CardHeader } from '../ui/Card'
import { DEFAULT_CASHBACK_TIERS } from '../../constants/cashback'
import { ensureCashbackRule, saveCashbackRule } from '../../services/cashbackRules'
import { formatBRL, formatPercent } from '../../utils/money'

function formatTierLimit(upToAmountCents) {
  if (upToAmountCents === null || upToAmountCents === undefined) return 'Acima do último teto'
  return `Até ${formatBRL(upToAmountCents)}`
}

export default function CashbackRulesPanel() {
  const [rule, setRule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    ensureCashbackRule()
      .then((data) => {
        if (active) setRule(data)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar as regras de cashback.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function handleResetDefaults() {
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const saved = await saveCashbackRule({
        name: 'Tabela progressiva por valor da compra',
        active: true,
        tiers: DEFAULT_CASHBACK_TIERS,
      })
      setRule(saved)
      setMessage('Tabela padrão restaurada.')
    } catch {
      setError('Não foi possível salvar as regras.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive() {
    if (!rule) return
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const saved = await saveCashbackRule({ ...rule, active: !rule.active })
      setRule(saved)
      setMessage(saved.active ? 'Regra ativada.' : 'Regra desativada.')
    } catch {
      setError('Não foi possível atualizar o status da regra.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title="Regras de cálculo do cashback"
        subtitle="Tabela centralizada usada no cálculo. Valores em faixas progressivas por valor da compra."
        action={
          rule && (
            <Badge variant={rule.active ? 'success' : 'warning'}>
              {rule.active ? 'Regra ativa' : 'Regra inativa'}
            </Badge>
          )
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-500">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm text-success-600">
          {message}
        </div>
      )}

      {rule && (
        <>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{rule.name}</p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-dark-card/50">
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Faixa da compra</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Cashback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {rule.tiers.map((tier, index) => (
                  <tr key={`${tier.upToAmountCents ?? 'open'}-${index}`}>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-100">{formatTierLimit(tier.upToAmountCents)}</td>
                    <td className="px-4 py-3 font-medium text-brand-600">{formatPercent(tier.percent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Fórmula: cashback = valor da compra × percentual / 100 (valores tratados em centavos).
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={handleToggleActive}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-dark-card"
            >
              {rule.active ? 'Desativar regra' : 'Ativar regra'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleResetDefaults}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Restaurar tabela padrão'}
            </button>
          </div>
        </>
      )}
    </Card>
  )
}
