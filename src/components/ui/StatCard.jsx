export default function StatCard({ label, value, change, changeType = 'neutral', icon, accent = 'brand' }) {
  const accentStyles = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
    success: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
    warning: 'bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-500',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  }

  const changeStyles = {
    up: 'text-success-600 dark:text-success-500',
    down: 'text-danger-500',
    neutral: 'text-slate-400 dark:text-slate-500',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-dark-surface">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">{value}</p>
          {change && (
            <p className={`mt-1.5 text-xs font-medium ${changeStyles[changeType]}`}>{change}</p>
          )}
        </div>
        {icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentStyles[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
