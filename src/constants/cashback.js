export const CASHBACK_RULE_DOC_ID = 'cashbackRules'

export const CASHBACK_STATUSES = {
  GENERATED: 'generated',
  AVAILABLE: 'available',
  CANCELLED: 'cancelled',
}

export const CASHBACK_STATUS_LABELS = {
  [CASHBACK_STATUSES.GENERATED]: 'Gerado',
  [CASHBACK_STATUSES.AVAILABLE]: 'Disponível',
  [CASHBACK_STATUSES.CANCELLED]: 'Cancelado',
}

export const PURCHASE_STATUSES = {
  REGISTERED: 'registered',
  CASHBACK_GENERATED: 'cashback_generated',
}

export const PURCHASE_STATUS_LABELS = {
  [PURCHASE_STATUSES.REGISTERED]: 'Registrada',
  [PURCHASE_STATUSES.CASHBACK_GENERATED]: 'Cashback gerado',
}

/**
 * Tabela demonstrativa progressiva por valor da compra.
 * percent: percentual aplicado (ex.: 0.5 = 0,5%).
 * upToAmountCents: teto do valor da compra em centavos (null = sem teto).
 */
export const DEFAULT_CASHBACK_TIERS = [
  { upToAmountCents: 10000, percent: 0.5 },
  { upToAmountCents: 50000, percent: 5 },
  { upToAmountCents: 100000, percent: 10 },
  { upToAmountCents: null, percent: 10 },
]

export const DEFAULT_CASHBACK_RULE = {
  name: 'Tabela progressiva por valor da compra',
  active: true,
  tiers: DEFAULT_CASHBACK_TIERS,
}
