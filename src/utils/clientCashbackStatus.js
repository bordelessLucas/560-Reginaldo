/**
 * Rótulos de exibição do status do cashback.
 * Reflete a configuração do cliente no Acelera Clube.
 */
export function getCashbackDisplayStatus(aceleraClube = {}) {
  const participatesInProgram = Boolean(aceleraClube.participatesInProgram)
  const cashbackEnabled = Boolean(aceleraClube.cashbackEnabled)

  if (!participatesInProgram) {
    return {
      key: 'not_participant',
      label: 'Não participante',
      variant: 'default',
      eligible: false,
    }
  }

  if (!cashbackEnabled) {
    return {
      key: 'inactive',
      label: 'Participante · Cashback inativo',
      variant: 'warning',
      eligible: false,
    }
  }

  return {
    key: 'active',
    label: 'Participante · Cashback ativo',
    variant: 'success',
    eligible: true,
  }
}
