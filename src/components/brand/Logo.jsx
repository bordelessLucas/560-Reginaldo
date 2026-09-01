import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const LOGOS = {
  light: '/brand/logo-light.png',
  dark: '/brand/logo-dark.png',
}

export default function Logo({
  compact = false,
  onDarkBackground = false,
  showProductName = false,
  layout = 'vertical',
  size,
}) {
  const { isDark } = useTheme()
  const [imageError, setImageError] = useState(false)

  const src = onDarkBackground || isDark ? LOGOS.dark : LOGOS.light
  const isHorizontal = layout === 'horizontal' && showProductName

  const sizeClasses = {
    topbar: 'h-10 max-w-[130px] sm:h-11 sm:max-w-[150px]',
    compact: 'h-8 max-w-[100px]',
    default: 'h-9 max-w-[120px] sm:h-10 sm:max-w-[140px]',
  }

  const imageClass = sizeClasses[size] || (compact ? sizeClasses.compact : sizeClasses.default)

  if (!imageError) {
    return (
      <div className={`flex ${isHorizontal ? 'items-center gap-3' : 'flex-col items-start gap-2'}`}>
        <img
          src={src}
          alt="Grupo SM Autopeças"
          className={`w-auto shrink-0 object-contain ${imageClass}`}
          onError={() => setImageError(true)}
        />
        {showProductName && (
          <div className="min-w-0">
            <p className={`truncate text-sm font-bold leading-tight ${onDarkBackground || isDark ? 'text-white' : 'text-navy-500'}`}>
              Acelera Clube
            </p>
            <p className={`truncate text-[10px] leading-tight ${onDarkBackground || isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              CRM Comercial
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
        AC
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-white">Acelera Clube</p>
          <p className="truncate text-[11px] leading-tight text-slate-400">Grupo SM Autopeças</p>
        </div>
      )}
    </div>
  )
}
