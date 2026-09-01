import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BackToHomeLink from '../components/auth/BackToHomeLink'
import { useAuth } from '../contexts/AuthContext'
import { inputClassName } from '../components/ui/inputStyles'
import { formatCpf, formatPhone, isValidCpf, isValidPhone } from '../utils/masks'
import { ROUTES } from '../utils/routes'

function getErrorMessage(error) {
  const messages = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/operation-not-allowed': 'Cadastro temporariamente indisponível.',
  }
  return messages[error.code] || 'Não foi possível criar a conta. Tente novamente.'
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validateForm() {
    if (!form.name.trim()) return 'Informe seu nome.'
    if (!isValidCpf(form.cpf)) return 'CPF inválido.'
    if (!isValidPhone(form.phone)) return 'Telefone inválido.'
    if (form.password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.'
    if (form.password !== form.confirmPassword) return 'As senhas não coincidem.'
    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      await register({
        name: form.name.trim(),
        cpf: form.cpf,
        phone: form.phone,
        email: form.email.trim(),
        password: form.password,
      })
      navigate(ROUTES.CLIENT_DASHBOARD, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BackToHomeLink />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Criar conta</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Cadastre-se para participar do Acelera Clube.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-500">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nome completo
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Seu nome"
            className={inputClassName}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cpf" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              CPF
            </label>
            <input
              id="cpf"
              required
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
              required
              value={form.phone}
              onChange={(e) => updateField('phone', formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="seu@email.com"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            placeholder="••••••••"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            placeholder="••••••••"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Já tem uma conta?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-700">
          Entrar
        </Link>
      </p>
    </div>
  )
}
