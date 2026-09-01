/**
 * Rótulos de exibição do status do cashback.
 * Não calcula valores — apenas reflete o cadastro atual do cliente.
 */
export function getCashbackDisplayStatus(aceleraClube = {}) {
  const participatesInProgram = Boolean(aceleraClube.participatesInProgram)
  const cashbackEnabled = Boolean(aceleraClube.cashbackEnabled)

  if (!participatesInProgram) {
    return { label: 'Não participante', variant: 'default' }
  }

  if (!cashbackEnabled) {
    return { label: 'Participante · Cashback inativo', variant: 'warning' }
  }

  return { label: 'Participante · Cashback ativo', variant: 'success' }
}
