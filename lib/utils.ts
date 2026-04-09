import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isThisWeek, isPast, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMM dd, yyyy')
}

export function formatDateInput(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM-dd')
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getTodayFormatted(): string {
  return format(new Date(), 'EEEE, MMMM do yyyy')
}

export function isOverdue(dueDate: Date | string | null | undefined): boolean {
  if (!dueDate) return false
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
  return isPast(d) && !isToday(d)
}

export function isTodayDate(date: Date | string | null | undefined): boolean {
  if (!date) return false
  const d = typeof date === 'string' ? parseISO(date) : date
  return isToday(d)
}

export function isThisWeekDate(date: Date | string | null | undefined): boolean {
  if (!date) return false
  const d = typeof date === 'string' ? parseISO(date) : date
  return isThisWeek(d, { weekStartsOn: 1 })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const PRIORITY_COLORS = {
  HIGH: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-700',
    dot: 'bg-rose-400',
    label: 'High',
  },
  MEDIUM: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
    dot: 'bg-purple-400',
    label: 'Medium',
  },
  LOW: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-700',
    dot: 'bg-amber-300',
    label: 'Low',
  },
} as const
