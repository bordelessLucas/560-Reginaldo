import { COLLECTIONS } from '../constants/collections'
import { PURCHASE_STATUSES } from '../constants/cashback'
import {
  createDocument,
  getCollection,
  getDocument,
  updateDocument,
  where,
} from './firestore'
import { reaisToCents } from '../utils/money'

export function validatePurchaseInput({ clientId, amountInput, invoiceNumber, purchaseDate }) {
  if (!clientId) return 'Selecione um cliente.'
  if (!invoiceNumber?.trim()) return 'Informe o número da nota fiscal.'
  if (!purchaseDate) return 'Informe a data da compra.'

  const date = new Date(`${purchaseDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Data da compra inválida.'

  const amountCents = reaisToCents(amountInput)
  if (amountCents === null) return 'Informe um valor válido.'
  if (amountCents <= 0) return 'O valor da compra deve ser maior que zero.'

  return ''
}

export async function findPurchaseByInvoice(invoiceNumber) {
  const normalized = invoiceNumber.trim()
  const results = await getCollection(COLLECTIONS.PURCHASES, [where('invoiceNumber', '==', normalized)])
  return results[0] || null
}

/**
 * Registra compra + nota fiscal associada a um cliente existente.
 * O cálculo de cashback fica no serviço dedicado (Sprint 5).
 */
export async function registerPurchase({
  clientId,
  amountInput,
  invoiceNumber,
  purchaseDate,
  createdByUid,
  createdByName,
}) {
  const validationError = validatePurchaseInput({
    clientId,
    amountInput,
    invoiceNumber,
    purchaseDate,
  })
  if (validationError) {
    const error = new Error(validationError)
    error.code = 'validation'
    throw error
  }

  const client = await getDocument(COLLECTIONS.CLIENTS, clientId)
  if (!client) {
    const error = new Error('Cliente não encontrado.')
    error.code = 'not-found'
    throw error
  }

  const duplicate = await findPurchaseByInvoice(invoiceNumber)
  if (duplicate) {
    const error = new Error('Já existe uma compra registrada com este número de nota fiscal.')
    error.code = 'duplicate-invoice'
    throw error
  }

  const amountCents = reaisToCents(amountInput)
  const purchaseId = await createDocument(COLLECTIONS.PURCHASES, {
    clientId,
    clientName: client.name || '',
    amountCents,
    invoiceNumber: invoiceNumber.trim(),
    purchaseDate,
    status: PURCHASE_STATUSES.REGISTERED,
    cashbackId: null,
    createdByUid: createdByUid || null,
    createdByName: createdByName || null,
  })

  return {
    id: purchaseId,
    clientId,
    clientName: client.name || '',
    amountCents,
    invoiceNumber: invoiceNumber.trim(),
    purchaseDate,
    status: PURCHASE_STATUSES.REGISTERED,
    cashbackId: null,
  }
}

export async function markPurchaseCashbackGenerated(purchaseId, cashbackId) {
  await updateDocument(COLLECTIONS.PURCHASES, purchaseId, {
    status: PURCHASE_STATUSES.CASHBACK_GENERATED,
    cashbackId,
  })
}
