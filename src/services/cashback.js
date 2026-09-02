import { CASHBACK_STATUSES, PURCHASE_STATUSES } from '../constants/cashback'
import { COLLECTIONS } from '../constants/collections'
import {
  calculateCashbackCents,
  getCashbackRule,
  isClientEligibleForCashback,
  resolveCashbackPercent,
} from './cashbackRules'
import {
  createDocument,
  getCollection,
  getDocument,
  where,
} from './firestore'
import { markPurchaseCashbackGenerated } from './purchases'

export async function findCashbackByPurchase(purchaseId) {
  const results = await getCollection(COLLECTIONS.CASHBACK, [where('purchaseId', '==', purchaseId)])
  return results[0] || null
}

/**
 * Valida elegibilidade e calcula/persiste cashback para uma compra.
 * Centralizado para reutilização futura (ex.: SS PLUS).
 */
export async function generateCashbackForPurchase(purchaseId, { createdByUid, createdByName } = {}) {
  const purchase = await getDocument(COLLECTIONS.PURCHASES, purchaseId)
  if (!purchase) {
    const error = new Error('Compra não encontrada.')
    error.code = 'purchase-not-found'
    throw error
  }

  const client = await getDocument(COLLECTIONS.CLIENTS, purchase.clientId)
  if (!client) {
    const error = new Error('Cliente da compra não encontrado.')
    error.code = 'client-not-found'
    throw error
  }

  if (purchase.clientId !== client.id) {
    const error = new Error('A compra não pertence a este cliente.')
    error.code = 'client-mismatch'
    throw error
  }

  if (!isClientEligibleForCashback(client)) {
    const error = new Error('Cliente não habilitado para cashback no Acelera Clube.')
    error.code = 'not-eligible'
    throw error
  }

  if (purchase.cashbackId || purchase.status === PURCHASE_STATUSES.CASHBACK_GENERATED) {
    const error = new Error('Cashback já foi gerado para esta compra.')
    error.code = 'already-generated'
    throw error
  }

  const existing = await findCashbackByPurchase(purchaseId)
  if (existing) {
    const error = new Error('Cashback já foi gerado para esta compra.')
    error.code = 'already-generated'
    throw error
  }

  const amountCents = Number(purchase.amountCents)
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    const error = new Error('Valor da compra inválido para cálculo.')
    error.code = 'invalid-amount'
    throw error
  }

  const rule = await getCashbackRule()
  if (!rule.active) {
    const error = new Error('A regra de cashback está inativa.')
    error.code = 'rule-inactive'
    throw error
  }

  const percentApplied = resolveCashbackPercent(amountCents, rule.tiers)
  if (percentApplied === null) {
    const error = new Error('Não há percentual válido para o valor desta compra.')
    error.code = 'no-percent'
    throw error
  }

  const cashbackAmountCents = calculateCashbackCents(amountCents, percentApplied)
  if (cashbackAmountCents === null || cashbackAmountCents < 0) {
    const error = new Error('Falha ao calcular o valor do cashback.')
    error.code = 'calc-error'
    throw error
  }

  const cashbackId = await createDocument(COLLECTIONS.CASHBACK, {
    clientId: client.id,
    clientName: client.name || '',
    purchaseId,
    invoiceNumber: purchase.invoiceNumber || '',
    purchaseAmountCents: amountCents,
    percentApplied,
    cashbackAmountCents,
    ruleId: rule.id,
    ruleName: rule.name,
    status: CASHBACK_STATUSES.GENERATED,
    createdByUid: createdByUid || null,
    createdByName: createdByName || null,
  })

  await markPurchaseCashbackGenerated(purchaseId, cashbackId)

  return {
    id: cashbackId,
    clientId: client.id,
    purchaseId,
    purchaseAmountCents: amountCents,
    percentApplied,
    cashbackAmountCents,
    status: CASHBACK_STATUSES.GENERATED,
  }
}
