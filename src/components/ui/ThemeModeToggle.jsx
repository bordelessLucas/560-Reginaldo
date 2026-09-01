import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeModeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Modo escuro ativo' : 'Modo claro ativo'}
      onClick={toggleTheme}
      className={`relative h-9 w-[4.5rem] shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
        isDark ? 'bg-slate-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 ${
          isDark ? 'left-[calc(100%-1.875rem)]' : 'left-1'
        }`}
      >
        {isDark ? (
          <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </span>

      <span className="sr-only">{isDark ? 'Escuro' : 'Claro'}</span>
    </button>
  )
}
