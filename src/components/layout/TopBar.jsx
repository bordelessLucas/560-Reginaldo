import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ROUTES } from '../../utils/routes'
import Logo from '../brand/Logo'

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Área do participante do Acelera Clube' },
  '/admin': { title: 'Dashboard', subtitle: 'Painel administrativo do Acelera Clube' },
}

function getPageMeta(pathname) {
  if (pathname.startsWith('/admin/clientes/')) {
    return { title: 'Dashboard', subtitle: 'Edição de cliente no painel administrativo' }
  }

  if (pathname.startsWith('/admin')) {
    return pageTitles['/admin']
  }

  return pageTitles[pathname] || pageTitles['/dashboard']
}

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const page = getPageMeta(location.pathname)
  const displayName = user?.displayName || 'Usuário'

  async function handleLogout() {
    navigate(ROUTES.HOME, { replace: true })
    await logout()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-black/5 bg-logo-bar-light px-4 dark:border-slate-600 dark:bg-dark-surface sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
          aria-label="Abrir menu"
          onClick={onMenuClick}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="lg:hidden">
          <Logo compact size="topbar" />
        </div>

        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{page.title}</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">{page.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative rounded-xl p-2 text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10"
          aria-label="Notificações"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <p className="max-w-[120px] truncate text-sm font-bold text-navy-500 dark:text-slate-100 sm:max-w-[180px] sm:text-base">
          {displayName}
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300/80 bg-white/60 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-danger-500/30 hover:bg-danger-50 hover:text-danger-500 dark:border-slate-600 dark:bg-dark-card dark:text-slate-200 dark:hover:border-danger-500/50 dark:hover:bg-danger-500/10"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  )
}
