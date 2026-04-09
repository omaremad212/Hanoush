'use client'

interface DBErrorBannerProps {
  message: string
}

export default function DBErrorBanner({ message }: DBErrorBannerProps) {
  const isEnvError =
    message.toLowerCase().includes('database_url') ||
    message.toLowerCase().includes('connection failed') ||
    message.toLowerCase().includes('connect')

  return (
    <div className="rounded-2xl border border-rose-200 dark:border-rose-800/40 bg-rose-50/80 dark:bg-rose-900/20 p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-rose-700 dark:text-rose-400 text-sm">
            {isEnvError ? 'Database not connected' : 'Could not load tasks'}
          </p>
          <p className="text-xs text-rose-600/80 dark:text-rose-400/70 mt-0.5 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {isEnvError && (
        <div className="pl-12 space-y-1.5">
          <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
            Fix in 3 steps:
          </p>
          <ol className="text-xs text-rose-600/80 dark:text-rose-400/60 space-y-1 list-decimal list-inside">
            <li>Go to <strong>Vercel → Your Project → Settings → Environment Variables</strong></li>
            <li>Add <code className="bg-rose-100 dark:bg-rose-900/40 px-1 py-0.5 rounded">DATABASE_URL</code> (from Vercel Postgres or Neon)</li>
            <li>Redeploy, then run <code className="bg-rose-100 dark:bg-rose-900/40 px-1 py-0.5 rounded">npx prisma db push</code></li>
          </ol>
        </div>
      )}
    </div>
  )
}
