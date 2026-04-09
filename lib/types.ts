export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export type FilterType = 'all' | 'today' | 'week' | 'completed' | 'overdue'

export interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  priority: Priority
  completed: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description?: string
  dueDate?: string
  priority: Priority
}

export interface StatsData {
  total: number
  completedToday: number
  pending: number
  overdue: number
}
