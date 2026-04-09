'use client'

import { StatsData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  gradient: string
  delay?: string
}

function StatCard({ title, value, icon, gradient, delay = '0s' }: StatCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-5 card-shadow animate-float',
        'transition-all duration-300 hover:scale-105 hover:shadow-lg'
      )}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-mauve/70 dark:text-pink-300/60 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className={cn('text-3xl font-bold font-playfair', gradient)}>
            {value}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-plum/10 to-mauve/20 dark:from-plum/40 dark:to-mauve/30 flex items-center justify-center text-plum dark:text-mauve">
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 card-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-8 w-12 rounded" />
        </div>
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
    </div>
  )
}

interface StatsCardsProps {
  stats: StatsData | null
  loading?: boolean
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      gradient: 'gradient-text',
      delay: '0s',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: 'Done Today',
      value: stats.completedToday,
      gradient: 'text-emerald-600 dark:text-emerald-400',
      delay: '0.5s',
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Pending',
      value: stats.pending,
      gradient: 'text-amber-600 dark:text-amber-400',
      delay: '1s',
      icon: (
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      gradient: 'text-rose-600 dark:text-rose-400',
      delay: '1.5s',
      icon: (
        <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  )
}
