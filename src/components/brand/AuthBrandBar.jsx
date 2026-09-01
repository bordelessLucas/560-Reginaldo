import { useState } from 'react'

const LOGO_SRC = '/brand/logo-light.png'

export default function AuthBrandBar() {
  const [imageError, setImageError] = useState(false)

  return (
    <header className="w-full shrink-0 border-b border-black/5 bg-logo-bar-light lg:hidden">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-6 py-5">
        {!imageError ? (
          <img
            src={LOGO_SRC}
            alt="Grupo SM Autopeças"
            className="h-12 w-auto max-w-[280px] object-contain sm:h-14"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            AC
          </div>
        )}

        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold leading-none tracking-tight sm:text-3xl">
            <span className="text-brand-600">Acelera</span>{' '}
            <span className="text-navy-500">Clube</span>
          </h1>
          <p className="mt-1.5 text-xs text-slate-600">CRM Comercial · Grupo SM Autopeças</p>
        </div>
      </div>
    </header>
  )
}
