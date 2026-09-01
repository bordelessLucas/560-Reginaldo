import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/routes'

export default function BackToHomeLink() {
  return (
    <Link
      to={ROUTES.HOME}
      className="mb-6 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Voltar para a página inicial
    </Link>
  )
}
