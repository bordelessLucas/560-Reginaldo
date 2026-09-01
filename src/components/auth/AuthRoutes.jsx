import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { USER_ROLES } from '../../constants/roles'
import { getHomeRouteForRole, ROUTES } from '../../utils/routes'

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface dark:bg-dark-bg">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
      </div>
    </div>
  )
}

export function ProtectedRoute() {
  const { user, profile, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />
  if (!profile) return <Navigate to={ROUTES.LOGIN} replace state={{ error: 'unprovisioned' }} />

  return <Outlet />
}

export function AdminRoute() {
  const { isAdmin, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!isAdmin) return <Navigate to={ROUTES.CLIENT_DASHBOARD} replace />

  return <Outlet />
}

export function ClientRoute() {
  const { role, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (role === USER_ROLES.ADMIN) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />

  return <Outlet />
}

export function PublicRoute() {
  const { user, profile, role, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (user && profile) return <Navigate to={getHomeRouteForRole(role)} replace />

  return <Outlet />
}
