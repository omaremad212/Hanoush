import { Priority } from '@/lib/types'
import { PRIORITY_COLORS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

export default function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const colors = PRIORITY_COLORS[priority]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        colors.bg,
        colors.text,
        colors.border,
        'border',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {colors.label}
    </span>
  )
}
