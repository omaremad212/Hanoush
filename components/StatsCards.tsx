'use client'

import { StatsData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  valueColor: string
  iconBg: string
  delay?: string
}

function StatCard({ title, value, icon, valueColor, iconBg, delay = '0s' }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border border-pink-100 card-shadow animate-float hover:scale-105 transition-transform duration-200 cursor-default"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          <p className={cn('text-3xl font-bold font-playfair', valueColor)}>{value}</p>
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-pink-100">
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

export default function StatsCards({ stats, loading }: { stats: StatsData | null; loading?: boolean }) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      valueColor: 'text-[#3D0026]',
      iconBg: 'bg-[#FFF0F3]',
      delay: '0s',
      icon: <svg className="w-5 h-5 text-[#C2185B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    },
    {
      title: 'Done Today',
      value: stats.completedToday,
      valueColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      delay: '0.4s',
      icon: <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      title: 'Pending',
      value: stats.pending,
      valueColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      delay: '0.8s',
      icon: <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      valueColor: 'text-red-600',
      iconBg: 'bg-red-50',
      delay: '1.2s',
      icon: <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    },
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => <StatCard key={card.title} {...card} />)}
    </div>
  )
}
