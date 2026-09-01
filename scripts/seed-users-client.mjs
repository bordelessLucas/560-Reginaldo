/**
 * Provisiona contas usando Firebase Client SDK (bootstrap sem conta de serviço).
 * Usado internamente durante setup inicial. Prefira: npm run firebase:seed
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'

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

async function upsertUser({ email, password, profile }) {
  let user

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    user = credential.user
    await updateProfile(user, { displayName: profile.name })
    console.log(`Criado Auth: ${email}`)
  } catch (error) {
    if (error.code !== 'auth/email-already-in-use') throw error
    const credential = await signInWithEmailAndPassword(auth, email, password)
    user = credential.user
    console.log(`Auth existente: ${email}`)
  }

  const userRef = doc(db, 'users', user.uid)
  const existing = await getDoc(userRef)

  if (existing.exists()) {
    console.log(`Perfil já existe: ${email}`)
    return
  }

  await setDoc(userRef, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  console.log(`Perfil Firestore: ${email} (${profile.role})`)
}

async function main() {
  for (const seedUser of SEED_USERS) {
    await upsertUser(seedUser)
  }

  console.log('\nContas provisionadas:')
  for (const { email, password, profile } of SEED_USERS) {
    console.log(`  [${profile.role}] ${email} / ${password}`)
  }
}

main().catch((error) => {
  console.error('Falha:', error.message)
  process.exit(1)
})
