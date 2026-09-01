/**
 * Cria clientes de exemplo na coleção `clients`.
 * Requer login como admin (credenciais em .env / README).
 *
 * Uso: npm run firebase:seed:clients
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where } from 'firebase/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  const envPath = join(__dirname, '..', '.env')
  const content = readFileSync(envPath, 'utf8')
  const env = {}

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    env[key] = rest.join('=')
  }

  return env
}

const env = loadEnv()

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})

const auth = getAuth(app)
const db = getFirestore(app)

const SEED_CLIENTS = [
  {
    name: 'João da Silva',
    email: 'joao.silva@email.com',
    cpf: '52998224725',
    phone: '11987654321',
    aceleraClube: { participatesInProgram: true, cashbackEnabled: true },
  },
  {
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    cpf: '39053344705',
    phone: '11912345678',
    aceleraClube: { participatesInProgram: true, cashbackEnabled: false },
  },
  {
    name: 'Carlos Pereira',
    email: 'carlos.pereira@email.com',
    cpf: '15350946056',
    phone: '11999887766',
    aceleraClube: { participatesInProgram: false, cashbackEnabled: false },
  },
]

async function upsertClient(client) {
  const clientsRef = collection(db, 'clients')
  const existing = await getDocs(query(clientsRef, where('email', '==', client.email)))

  if (!existing.empty) {
    console.log(`Cliente já existe: ${client.email}`)
    return
  }

  await addDoc(clientsRef, {
    ...client,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  console.log(`Cliente criado: ${client.name}`)
}

async function main() {
  await signInWithEmailAndPassword(auth, 'admin@aceleraclube.com.br', 'AceleraAdmin2026!')

  for (const client of SEED_CLIENTS) {
    await upsertClient(client)
  }

  console.log('\nSeed de clientes concluído.')
}

main().catch((error) => {
  console.error('Falha no seed de clientes:', error.message)
  process.exit(1)
})
