'use client'

import { useEffect, useState, useCallback } from 'react'
import AppShell from '@/components/AppShell'
import StatsCards from '@/components/StatsCards'
import TaskList from '@/components/TaskList'
import TaskFormModal from '@/components/TaskFormModal'
import DBErrorBanner from '@/components/DBErrorBanner'
import { Task, TaskFormData, StatsData } from '@/lib/types'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setDbError(null)
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      if (!res.ok) {
        setDbError(data.error ?? 'Failed to fetch tasks')
        return
      }
      setTasks(data.tasks)
      setStats(data.stats)
    } catch {
      setDbError('Network error — could not reach the server.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAddTask = async (data: TaskFormData) => {
    setAddLoading(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? 'Failed to add task'); return }
      setTasks((prev) => [json, ...prev])
      setStats((prev) => prev ? { ...prev, total: prev.total + 1, pending: prev.pending + 1 } : prev)
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
    const today = new Date(); today.setHours(0, 0, 0, 0)
    setStats({
      total: updated.length,
      completedToday: updated.filter((t) => t.completed && new Date(t.updatedAt) >= today).length,
      pending: updated.filter((t) => !t.completed).length,
      overdue: updated.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < today).length,
    })
  }

  return (
    <>
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#3D0026] dark:text-pink-50">
                Dashboard
              </h1>
              <p className="text-sm text-[#C2185B]/60 dark:text-pink-400/60 mt-0.5">
                Here&apos;s your overview for today
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
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
              <StatsCards stats={stats} loading={loading} />

              <div className="bg-white dark:bg-[#3d0030] rounded-2xl border border-pink-100 dark:border-[#E91E8C]/15 p-5 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-playfair text-lg font-semibold text-[#3D0026] dark:text-pink-50">Recent Tasks</h2>
                  <a href="/tasks" className="text-xs text-[#C2185B] dark:text-[#E91E8C] hover:text-[#880E4F] dark:hover:text-pink-300 transition-colors font-medium">
                    View all →
                  </a>
                </div>
                <TaskList tasks={tasks.slice(0, 8)} loading={loading} onTasksChange={handleTasksChange} />
              </div>
            </>
          )}
        </div>
      </AppShell>

      {showAddModal && (
        <TaskFormModal mode="add" onClose={() => setShowAddModal(false)} onSubmit={handleAddTask} loading={addLoading} />
      )}
    </>
  )
}
