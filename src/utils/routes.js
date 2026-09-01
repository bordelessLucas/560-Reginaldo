import { USER_ROLES } from '../constants/roles'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/cadastro',
  CLIENT_DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_CLIENT_EDIT: '/admin/clientes/:id',
}

export function getHomeRouteForRole(role) {
  return role === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.CLIENT_DASHBOARD
}
