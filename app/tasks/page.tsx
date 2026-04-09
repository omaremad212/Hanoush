'use client'

import { useEffect, useState, useCallback } from 'react'
import AppShell from '@/components/AppShell'
import TaskList from '@/components/TaskList'
import TaskFormModal from '@/components/TaskFormModal'
import DBErrorBanner from '@/components/DBErrorBanner'
import { Task, TaskFormData, FilterType } from '@/lib/types'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const FILTERS: { label: string; value: FilterType; emoji: string }[] = [
  { label: 'All', value: 'all', emoji: '📋' },
  { label: 'Today', value: 'today', emoji: '☀️' },
  { label: 'This Week', value: 'week', emoji: '📅' },
  { label: 'Completed', value: 'completed', emoji: '✅' },
  { label: 'Overdue', value: 'overdue', emoji: '⚠️' },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')

  const fetchTasks = useCallback(async () => {
    setDbError(null)
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      if (!res.ok) {
        setDbError(data.error ?? 'Failed to fetch tasks')
        return
      }
      setTasks(data.tasks)
    } catch {
      setDbError('Network error — could not reach the server.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleAddTask = async (data: TaskFormData) => {
    setAddLoading(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to add task')
        return
      }
      setTasks((prev) => [json, ...prev])
      setShowAddModal(false)
      toast.success('Task added! ✨')
    } catch {
      toast.error('Failed to add task')
    } finally {
      setAddLoading(false)
    }
  }

  const filterCounts = {
    all: tasks.length,
    today: tasks.filter((t) => {
      if (!t.dueDate || t.completed) return false
      return new Date(t.dueDate).toDateString() === new Date().toDateString()
    }).length,
    week: tasks.filter((t) => {
      if (!t.dueDate || t.completed) return false
      const d = new Date(t.dueDate)
      const now = new Date()
      const weekEnd = new Date(now)
      weekEnd.setDate(now.getDate() + 7)
      return d >= now && d <= weekEnd
    }).length,
    completed: tasks.filter((t) => t.completed).length,
    overdue: tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false
      const d = new Date(t.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return d < today
    }).length,
  }

  return (
    <>
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-plum dark:text-pink-200">
                My Tasks
              </h1>
              <p className="text-sm text-mauve/70 dark:text-pink-300/50 mt-0.5">
                {tasks.filter((t) => !t.completed).length} pending tasks
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {dbError ? (
            <DBErrorBanner message={dbError} />
          ) : (
            <>
              {/* Search */}
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mauve/50 dark:text-pink-400/40 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-base pl-10"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-pink-400/40 dark:hover:text-pink-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
                      filter === f.value
                        ? 'bg-gradient-to-r from-plum to-plum-light text-white shadow-sm'
                        : 'bg-white/70 dark:bg-plum-dark/40 text-gray-600 dark:text-pink-300/70 hover:bg-pink-50 dark:hover:bg-plum-dark/70 border border-pink-200/60 dark:border-plum-light/20'
                    )}
                  >
                    <span>{f.emoji}</span>
                    {f.label}
                    <span
                      className={cn(
                        'ml-0.5 px-1.5 py-0.5 rounded-full text-xs',
                        filter === f.value
                          ? 'bg-white/20 text-white'
                          : 'bg-pink-100 dark:bg-plum-light/20 text-plum dark:text-pink-300'
                      )}
                    >
                      {filterCounts[f.value]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Task list */}
              <div className="glass rounded-2xl p-5 card-shadow">
                <TaskList
                  tasks={tasks}
                  loading={loading}
                  filter={filter}
                  searchQuery={search}
                  onTasksChange={setTasks}
                />
              </div>
            </>
          )}
        </div>
      </AppShell>

      {showAddModal && (
        <TaskFormModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTask}
          loading={addLoading}
        />
      )}
    </>
  )
}
