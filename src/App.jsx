import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoute, ClientRoute, ProtectedRoute, PublicRoute } from './components/auth/AuthRoutes'
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'
import AdminDashboard from './pages/AdminDashboard'
import ClientDashboard from './pages/ClientDashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { ROUTES } from './utils/routes'

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<ClientRoute />}>
            <Route path={ROUTES.CLIENT_DASHBOARD} element={<ClientDashboard />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_CLIENT_EDIT} element={<AdminDashboard />} />
            <Route path="/admin/clientes" element={<Navigate to="/admin?secao=clientes" replace />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}
