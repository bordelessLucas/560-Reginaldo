import Badge from '../ui/Badge'
import { CardHeader } from '../ui/Card'
import { getCashbackDisplayStatus } from '../../utils/clientCashbackStatus'

function ToggleField({ id, label, description, checked, onChange, disabled }) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700 ${
        disabled ? 'opacity-60' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-card/50'
      }`}
    >
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p>
        {description && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
    </label>
  )
}

export default function ClientCashbackSection({ value, onChange, disabled }) {
  const status = getCashbackDisplayStatus(value)

  function updateField(field, fieldValue) {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <section>
      <CardHeader
        title="Acelera Clube · Cashback"
        subtitle="Configuração da assinatura e cashback deste cliente. Regras de cálculo serão definidas posteriormente."
      />

      <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-dark-card/60">
        <span className="text-sm text-slate-600 dark:text-slate-300">Status atual:</span>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="space-y-3">
        <ToggleField
          id="participatesInProgram"
          label="Participação no programa"
          description="Indica se o cliente participa do Acelera Clube (assinatura)."
          checked={Boolean(value.participatesInProgram)}
          disabled={disabled}
          onChange={(checked) => updateField('participatesInProgram', checked)}
        />

        <ToggleField
          id="cashbackEnabled"
          label="Cashback ativo"
          description="Ativa ou desativa o cashback para este cliente."
          checked={Boolean(value.cashbackEnabled)}
          disabled={disabled || !value.participatesInProgram}
          onChange={(checked) => updateField('cashbackEnabled', checked)}
        />
      </div>

      {!value.participatesInProgram && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Ative a participação no programa para configurar o cashback.
        </p>
      )}
    </section>
  )
}
