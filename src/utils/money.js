/** Valores monetários em centavos (inteiros) para evitar erro de ponto flutuante. */

export function reaisToCents(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value * 100)
  }

  const normalized = String(value)
    .trim()
    .replace(/\s/g, '')
    .replace(/R\$\s?/i, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed)) return null
  return Math.round(parsed * 100)
}

export function centsToReais(cents) {
  return (Number(cents) || 0) / 100
}

export function formatBRL(cents) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centsToReais(cents))
}

export function formatPercent(percent) {
  const value = Number(percent)
  if (!Number.isFinite(value)) return '—'
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`
}
