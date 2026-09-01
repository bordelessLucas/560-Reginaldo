import { Outlet } from 'react-router-dom'
import AuthBrandBar from '../brand/AuthBrandBar'
import Logo from '../brand/Logo'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-navy-900" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="relative z-10 p-10">
          <Logo onDarkBackground showProductName />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-10">
          <span className="mb-3 inline-flex w-fit rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300">
            Programa de fidelidade
          </span>
          <h1 className="max-w-md text-3xl font-bold leading-tight text-white xl:text-4xl">
            Acelera Clube
          </h1>
          <p className="mt-3 max-w-md text-lg font-medium text-slate-300">
            Trabalhe melhor sua base de clientes
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
            CRM comercial integrado ao ECS Plus com cashback e fidelização.
            Uma solução do Grupo SM Autopeças.
          </p>

          <ul className="mt-8 space-y-3">
            {['Gestão de clientes e histórico', 'Cashback automático', 'Integração ECS Plus'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <svg className="h-5 w-5 shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="relative z-10 p-10">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Acelera Clube · Grupo SM Autopeças
          </p>
        </div>
      </div>

      <div className="relative flex w-full flex-col bg-white lg:w-1/2">
        <AuthBrandBar />

        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 lg:py-12">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
