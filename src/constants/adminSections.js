export const ADMIN_SECTIONS = {
  OVERVIEW: 'visao',
  CLIENTS: 'clientes',
  CASHBACK: 'cashback',
}

export function getAdminDashboardPath(section) {
  if (!section || section === ADMIN_SECTIONS.OVERVIEW) {
    return '/admin'
  }

  return `/admin?secao=${section}`
}
