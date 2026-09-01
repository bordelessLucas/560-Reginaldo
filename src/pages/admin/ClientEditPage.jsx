import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ClientCashbackSection from '../../components/admin/ClientCashbackSection'
import Card, { CardHeader } from '../../components/ui/Card'
import { COLLECTIONS } from '../../constants/collections'
import { useDocument } from '../../hooks/useFirestore'
import { updateDocument } from '../../services/firestore'
import { formatCpf, formatPhone, isValidCpf, isValidPhone } from '../../utils/masks'
import { ADMIN_SECTIONS, getAdminDashboardPath } from '../../constants/adminSections'
import { inputClassName } from '../../components/ui/inputStyles'

const defaultAceleraClube = {
  participatesInProgram: false,
  cashbackEnabled: false,
}

export default function ClientEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: client, loading, error } = useDocument(COLLECTIONS.CLIENTS, id)

  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    aceleraClube: defaultAceleraClube,
  })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!client) return

    setForm({
      name: client.name || '',
      email: client.email || '',
      cpf: client.cpf ? formatCpf(client.cpf) : '',
      phone: client.phone ? formatPhone(client.phone) : '',
      aceleraClube: {
        ...defaultAceleraClube,
        ...client.aceleraClube,
      },
    })
  }, [client])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setSuccess(false)
  }

  function validateForm() {
    if (!form.name.trim()) return 'Informe o nome do cliente.'
    if (form.cpf && !isValidCpf(form.cpf)) return 'CPF inválido.'
    if (form.phone && !isValidPhone(form.phone)) return 'Telefone inválido.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'E-mail inválido.'
    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setSuccess(false)

    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    const aceleraClube = {
      participatesInProgram: Boolean(form.aceleraClube.participatesInProgram),
      cashbackEnabled: form.aceleraClube.participatesInProgram
        ? Boolean(form.aceleraClube.cashbackEnabled)
        : false,
    }

    setSaving(true)

    try {
      await updateDocument(COLLECTIONS.CLIENTS, id, {
        name: form.name.trim(),
        email: form.email.trim(),
        cpf: form.cpf.replace(/\D/g, ''),
        phone: form.phone.replace(/\D/g, ''),
        aceleraClube,
      })
      setSuccess(true)
    } catch {
      setFormError('Não foi possível salvar as alterações.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-sm text-danger-500">Cliente não encontrado.</p>
        <Link to={getAdminDashboardPath(ADMIN_SECTIONS.CLIENTS)} className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Voltar para clientes
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Editar cliente</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{client.name}</p>
        </div>
        <Link
          to={getAdminDashboardPath(ADMIN_SECTIONS.CLIENTS)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-dark-card"
        >
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-500">
            {formError}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm text-success-600">
            Alterações salvas com sucesso.
          </div>
        )}

        <Card>
          <CardHeader title="Dados cadastrais" subtitle="Informações de identificação do cliente." />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nome
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="cpf" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                CPF
              </label>
              <input
                id="cpf"
                value={form.cpf}
                onChange={(e) => updateField('cpf', formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Telefone
              </label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField('phone', formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                className={inputClassName}
              />
            </div>
          </div>
        </Card>

        <Card>
          <ClientCashbackSection
            value={form.aceleraClube}
            disabled={saving}
            onChange={(aceleraClube) => {
              setForm((current) => ({ ...current, aceleraClube }))
              setSuccess(false)
            }}
          />
        </Card>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(getAdminDashboardPath(ADMIN_SECTIONS.CLIENTS))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-dark-card"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
