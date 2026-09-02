export const navigation = [
  {
    section: 'Principal',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: 'dashboard', roles: ['admin'] },
      { id: 'dashboard-client', label: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['client'] },
      { id: 'clientes', label: 'Clientes', path: '/admin', section: 'clientes', icon: 'users', roles: ['admin'] },
      { id: 'compras', label: 'Compras', path: '/admin', section: 'compras', icon: 'shopping', roles: ['admin'] },
    ],
  },
  {
    section: 'Acelera Clube',
    items: [
      { id: 'cashback', label: 'Meu Cashback', path: '#', icon: 'cashback', badge: 'Em breve', roles: ['client'] },
      { id: 'cashback-admin', label: 'Cashback', path: '/admin', section: 'cashback', icon: 'cashback', roles: ['admin'] },
      { id: 'participantes', label: 'Participantes', path: '#', icon: 'star', badge: 'Em breve', roles: ['admin'] },
    ],
  },
  {
    section: 'Comercial',
    roles: ['admin'],
    items: [
      { id: 'funil', label: 'Funil Comercial', path: '#', icon: 'funnel', badge: 'Fase 2', roles: ['admin'] },
      { id: 'campanhas', label: 'Campanhas', path: '#', icon: 'megaphone', badge: 'Fase 2', roles: ['admin'] },
      { id: 'atendimento', label: 'Atendimento', path: '#', icon: 'chat', badge: 'Fase 2', roles: ['admin'] },
      { id: 'segmentacao', label: 'Segmentação', path: '#', icon: 'filter', badge: 'Fase 2', roles: ['admin'] },
    ],
  },
  {
    section: 'Sistema',
    items: [
      { id: 'ecs-plus', label: 'Integração ECS Plus', path: '#', icon: 'integration', badge: 'Em breve', roles: ['admin'] },
      { id: 'configuracoes', label: 'Configurações', icon: 'settings', action: 'settings', roles: ['client', 'admin'] },
    ],
  },
]

export function getNavigationForRole(role) {
  return navigation
    .filter((group) => !group.roles || group.roles.includes(role))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0)
}
