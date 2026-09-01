import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ADMIN_SECTIONS } from '../../constants/adminSections'
import { useAuth } from '../../contexts/AuthContext'
import { getNavigationForRole } from '../../data/navigation'
import { ROUTES } from '../../utils/routes'
import Logo from '../brand/Logo'
import Badge from '../ui/Badge'
import Icon from '../ui/Icon'
import SettingsModal from '../ui/SettingsModal'

function getActiveSection(search) {
  return new URLSearchParams(search).get('secao') || ADMIN_SECTIONS.OVERVIEW
}

function isNavItemActive(item, pathname, search) {
  if (!item.path || item.path === '#') return false

  if (item.section) {
    if (pathname.startsWith('/admin/clientes/')) {
      return item.section === ADMIN_SECTIONS.CLIENTS
    }

    return pathname === '/admin' && getActiveSection(search) === item.section
  }

  if (item.path === '/admin') {
    return pathname === '/admin' && getActiveSection(search) === ADMIN_SECTIONS.OVERVIEW
  }

  return pathname === item.path || pathname.startsWith(`${item.path}/`)
}

function NavItem({ item, isActive, onNavigate }) {
  const isDisabled = Boolean(item.badge)

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => !isDisabled && onNavigate?.(item)}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
        isActive
          ? 'bg-brand-500/15 text-brand-400'
          : isDisabled
            ? 'cursor-default text-slate-500'
            : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
      }`}
    >
      <Icon
        name={item.icon}
        className={`h-5 w-5 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'}`}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <Badge variant={item.badge === 'Fase 2' ? 'phase' : 'default'} className="shrink-0">
          {item.badge}
        </Badge>
      )}
    </button>
  )
}

export default function Sidebar({ open, onClose }) {
  const { logout, role, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const filteredNavigation = getNavigationForRole(role)

  function handleNavigate(item) {
    if (item.action === 'settings') {
      setSettingsOpen(true)
      onClose?.()
      return
    }

    if (item.section) {
      navigate({ pathname: '/admin', search: `?secao=${item.section}` })
      onClose?.()
      return
    }

    if (item.path && item.path !== '#') {
      navigate(item.path)
      onClose?.()
    }
  }

  async function handleLogout() {
    navigate(ROUTES.HOME, { replace: true })
    await logout()
  }

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
          <Logo onDarkBackground showProductName layout="horizontal" compact />
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-sidebar-hover hover:text-white lg:hidden"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          {filteredNavigation.map((group) => (
            <div key={group.section} className="mb-6 last:mb-0">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {group.section}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <NavItem
                      item={item}
                      isActive={isNavItemActive(item, location.pathname, location.search)}
                      onNavigate={handleNavigate}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border p-4">
          {isAdmin && (
            <div className="rounded-xl bg-sidebar-hover p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-2 w-2 rounded-full bg-warning-500" />
                <p className="text-xs font-medium text-slate-300">Integração ECS Plus</p>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Aguardando documentação e credenciais da API.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-danger-500/50 hover:bg-danger-500/10 hover:text-danger-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
