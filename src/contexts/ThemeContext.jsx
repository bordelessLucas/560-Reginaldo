import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'acelera-clube-theme'
const ThemeContext = createContext(null)

function getStoredTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

function applyThemeClass(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

function runThemeTransition(callback) {
  const root = document.documentElement
  root.classList.add('theme-transition')
  callback()
  window.setTimeout(() => root.classList.remove('theme-transition'), 400)
}

export function ThemeProvider({ children }) {
  const { user } = useAuth()
  const [preference, setPreference] = useState(getStoredTheme)

  const theme = user ? preference : 'light'

  useEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    runThemeTransition(() => {
      setPreference((current) => {
        const next = current === 'dark' ? 'light' : 'dark'
        localStorage.setItem(STORAGE_KEY, next)
        applyThemeClass(next)
        return next
      })
    })
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme,
      canToggleTheme: Boolean(user),
    }),
    [theme, toggleTheme, user],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  }
  return context
}
