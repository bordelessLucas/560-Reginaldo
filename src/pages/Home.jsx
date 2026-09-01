import { Link } from 'react-router-dom'
import Logo from '../components/brand/Logo'
import { ROUTES } from '../utils/routes'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-black/5 bg-logo-bar-light">
        <div className="mx-auto flex max-w-5xl items-center px-6 py-4">
          <Logo showProductName layout="horizontal" compact />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          <span className="text-brand-600">Acelera</span>{' '}
          <span className="text-navy-500">Clube</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          CRM comercial integrado ao ECS Plus com cashback e fidelização.
          Uma solução do Grupo SM Autopeças.
        </p>

        <div className="mt-8 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-slate-700">Acesse sua conta ou cadastre-se</p>
          <div className="flex flex-col gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Entrar
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Fazer cadastro
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/5 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Acelera Clube · Grupo SM Autopeças
      </footer>
    </div>
  )
}
