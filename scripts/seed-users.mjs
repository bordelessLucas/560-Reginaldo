/**
 * Provisiona contas de acesso no Firebase Auth + Firestore.
 *
 * Uso:
 *   1. Baixe a chave de conta de serviço no Firebase Console
 *      (Configurações do projeto → Contas de serviço → Gerar nova chave privada)
 *   2. Salve como scripts/service-account.json (não versionar)
 *   3. Execute: npm run firebase:seed
 */

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import admin from 'firebase-admin'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serviceAccountPath = join(__dirname, 'service-account.json')
const projectId = 'reginaldo-c6c8e'

const SEED_USERS = [
  {
    email: 'admin@aceleraclube.com.br',
    password: 'AceleraAdmin2026!',
    profile: {
      name: 'Administrador',
      email: 'admin@aceleraclube.com.br',
      role: 'admin',
    },
  },
  {
    email: 'cliente@aceleraclube.com.br',
    password: 'AceleraCliente2026!',
    profile: {
      name: 'Cliente Teste',
      email: 'cliente@aceleraclube.com.br',
      cpf: '00000000000',
      phone: '11999999999',
      role: 'client',
    },
  },
]

function initializeFirebase() {
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    })
    return
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ projectId })
    return
  }

  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    })
  } catch {
    console.error('Credenciais não encontradas.')
    console.error('Salve a chave de conta de serviço em scripts/service-account.json')
    console.error('ou defina GOOGLE_APPLICATION_CREDENTIALS.')
    process.exit(1)
  }
}

async function upsertUser({ email, password, profile }) {
  const auth = admin.auth()
  const db = admin.firestore()

  let userRecord
  try {
    userRecord = await auth.getUserByEmail(email)
    await auth.updateUser(userRecord.uid, { password, displayName: profile.name })
    console.log(`Atualizado Auth: ${email}`)
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error
    userRecord = await auth.createUser({
      email,
      password,
      displayName: profile.name,
      emailVerified: true,
    })
    console.log(`Criado Auth: ${email}`)
  }

  await db.collection('users').doc(userRecord.uid).set(
    {
      ...profile,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
  console.log(`Perfil Firestore: ${email} (${profile.role})`)
}

async function main() {
  initializeFirebase()

  for (const seedUser of SEED_USERS) {
    await upsertUser(seedUser)
  }

  console.log('\nContas provisionadas com sucesso:')
  for (const { email, password, profile } of SEED_USERS) {
    console.log(`  [${profile.role}] ${email} / ${password}`)
  }

  process.exit(0)
}

main().catch((error) => {
  console.error('Falha ao provisionar contas:', error.message)
  process.exit(1)
})
