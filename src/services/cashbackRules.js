import { CASHBACK_RULE_DOC_ID, DEFAULT_CASHBACK_RULE } from '../constants/cashback'
import { COLLECTIONS } from '../constants/collections'
import { getDocument, setDocument } from './firestore'

export function isClientEligibleForCashback(client) {
  const config = client?.aceleraClube
  return Boolean(config?.participatesInProgram && config?.cashbackEnabled)
}

export function normalizeCashbackRule(rule) {
  if (!rule) return { ...DEFAULT_CASHBACK_RULE, id: CASHBACK_RULE_DOC_ID }

  const tiers = Array.isArray(rule.tiers) && rule.tiers.length > 0 ? rule.tiers : DEFAULT_CASHBACK_RULE.tiers

  return {
    id: rule.id || CASHBACK_RULE_DOC_ID,
    name: rule.name || DEFAULT_CASHBACK_RULE.name,
    active: rule.active !== false,
    tiers: tiers.map((tier) => ({
      upToAmountCents:
        tier.upToAmountCents === null || tier.upToAmountCents === undefined
          ? null
          : Number(tier.upToAmountCents),
      percent: Number(tier.percent),
    })),
  }
}

/** Resolve o percentual da faixa aplicável ao valor da compra (em centavos). */
export function resolveCashbackPercent(amountCents, tiers = DEFAULT_CASHBACK_TIERS) {
  if (!Number.isFinite(amountCents) || amountCents <= 0) return null

  const sorted = [...tiers].sort((a, b) => {
    const aMax = a.upToAmountCents ?? Number.POSITIVE_INFINITY
    const bMax = b.upToAmountCents ?? Number.POSITIVE_INFINITY
    return aMax - bMax
  })

  for (const tier of sorted) {
    if (tier.upToAmountCents === null || amountCents <= tier.upToAmountCents) {
      return Number(tier.percent)
    }
  }

  return Number(sorted[sorted.length - 1]?.percent ?? null)
}

/** cashbackCents = round(valorCents × percentual / 100) */
export function calculateCashbackCents(amountCents, percent) {
  if (!Number.isFinite(amountCents) || amountCents <= 0) return null
  if (!Number.isFinite(percent) || percent < 0) return null
  return Math.round((amountCents * percent) / 100)
}

export async function getCashbackRule() {
  const doc = await getDocument(COLLECTIONS.SETTINGS, CASHBACK_RULE_DOC_ID)
  return normalizeCashbackRule(doc)
}

export async function ensureCashbackRule() {
  const existing = await getDocument(COLLECTIONS.SETTINGS, CASHBACK_RULE_DOC_ID)
  if (existing) return normalizeCashbackRule(existing)

  await setDocument(COLLECTIONS.SETTINGS, CASHBACK_RULE_DOC_ID, DEFAULT_CASHBACK_RULE, false)
  return normalizeCashbackRule({ id: CASHBACK_RULE_DOC_ID, ...DEFAULT_CASHBACK_RULE })
}

export async function saveCashbackRule(rule) {
  const normalized = normalizeCashbackRule(rule)
  await setDocument(
    COLLECTIONS.SETTINGS,
    CASHBACK_RULE_DOC_ID,
    {
      name: normalized.name,
      active: normalized.active,
      tiers: normalized.tiers,
    },
    true,
  )
  return normalized
}
