import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { USER_ROLES } from '../constants/roles'
import { auth } from '../lib/firebase'
import { getDocument, setDocument } from '../services/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const userProfile = await getDocument('users', currentUser.uid)
          if (!active) return

          if (!userProfile) {
            await signOut(auth)
            setProfile(null)
          } else {
            setProfile(userProfile)
          }
        } catch {
          if (active) {
            await signOut(auth)
            setProfile(null)
          }
        }
      } else if (active) {
        setProfile(null)
      }

      if (active) setLoading(false)
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const role = profile?.role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.CLIENT

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      isAdmin: role === USER_ROLES.ADMIN,
      loading,
      login: async (email, password) => {
        const credential = await signInWithEmailAndPassword(auth, email, password)
        const userProfile = await getDocument('users', credential.user.uid)

        if (!userProfile) {
          await signOut(auth)
          const error = new Error('Conta não provisionada no sistema.')
          error.code = 'auth/unprovisioned-account'
          throw error
        }

        return { credential, profile: userProfile }
      },
      register: async ({ name, cpf, phone, email, password }) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(credential.user, { displayName: name })
        await setDocument(
          'users',
          credential.user.uid,
          {
            name,
            cpf: cpf.replace(/\D/g, ''),
            phone: phone.replace(/\D/g, ''),
            email,
            role: USER_ROLES.CLIENT,
          },
          false,
        )
        return credential
      },
      logout: () => signOut(auth),
    }),
    [user, profile, role, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
