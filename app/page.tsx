'use client'

import { useEffect, useState, useCallback } from 'react'
import AppShell from '@/components/AppShell'
import StatsCards from '@/components/StatsCards'
import TaskList from '@/components/TaskList'
import TaskFormModal from '@/components/TaskFormModal'
import NamePrompt from '@/components/NamePrompt'
import { Task, TaskFormData, StatsData } from '@/lib/types'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [hasName, setHasName] = useState<boolean | null>(null)

  useEffect(() => {
    const name = localStorage.getItem('userName')
    setHasName(!!name)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setTasks(data.tasks)
      setStats(data.stats)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (hasName !== null) fetchData()
  }, [hasName, fetchData])

  const handleAddTask = async (data: TaskFormData) => {
    setAddLoading(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const newTask: Task = await res.json()
      setTasks((prev) => [newTask, ...prev])
      setStats((prev) =>
        prev ? { ...prev, total: prev.total + 1, pending: prev.pending + 1 } : prev
      )
      setShowAddModal(false)
      toast.success('Task added! ✨')
    } catch {
      toast.error('Failed to add task')
    } finally {
      setAddLoading(false)
    }
  }

  const handleTasksChange = (updated: Task[]) => {
    setTasks(updated)
    // Recompute stats
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    setStats({
      total: updated.length,
      completedToday: updated.filter((t) => {
        if (!t.completed) return false
        const u = new Date(t.updatedAt)
        return u >= today
      }).length,
      pending: updated.filter((t) => !t.completed).length,
      overdue: updated.filter((t) => {
        if (t.completed || !t.dueDate) return false
        const d = new Date(t.dueDate)
        return d < today
      }).length,
    })
  }

  if (hasName === null) return null // prevent flash

  return (
    <>
      {hasName === false && (
        <NamePrompt onSave={(name) => {
          setHasName(true)
          window.dispatchEvent(new Event('profileUpdated'))
        }} />
      )}

      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-plum dark:text-pink-200">
                Dashboard
              </h1>
              <p className="text-sm text-mauve/70 dark:text-pink-300/50 mt-0.5">
                Here&apos;s your overview for today
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

          {/* Stats */}
          <StatsCards stats={stats} loading={loading} />

          {/* Recent tasks */}
          <div className="glass rounded-2xl p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-lg font-semibold text-plum dark:text-pink-200">
                Recent Tasks
              </h2>
              <a
                href="/tasks"
                className="text-xs text-mauve hover:text-plum dark:text-mauve/70 dark:hover:text-mauve transition-colors font-medium"
              >
                View all →
              </a>
            </div>

            <TaskList
              tasks={tasks.slice(0, 8)}
              loading={loading}
              onTasksChange={handleTasksChange}
            />
          </div>
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
