import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BackToHomeLink from '../components/auth/BackToHomeLink'
import { useAuth } from '../contexts/AuthContext'
import { inputClassName } from '../components/ui/inputStyles'
import { getHomeRouteForRole, ROUTES } from '../utils/routes'

function getErrorMessage(error) {
  const messages = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/unprovisioned-account': 'Esta conta não está habilitada. Solicite acesso ao administrador.',
  }
  return messages[error.code] || 'Não foi possível entrar. Verifique seus dados.'
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(
    location.state?.error === 'unprovisioned'
      ? 'Esta conta não está habilitada. Solicite acesso ao administrador.'
      : '',
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { profile } = await login(email, password)
      navigate(getHomeRouteForRole(profile.role), { replace: true })
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Entrar no sistema</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Acesse sua conta para participar do Acelera Clube.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-500">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Não tem uma conta?{' '}
        <Link to={ROUTES.REGISTER} className="font-semibold text-brand-600 hover:text-brand-700">
          Fazer cadastro
        </Link>
      </p>
    </div>
  )
}
