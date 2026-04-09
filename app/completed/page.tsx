'use client'

import { useEffect, useState, useCallback } from 'react'
import AppShell from '@/components/AppShell'
import TaskList from '@/components/TaskList'
import DBErrorBanner from '@/components/DBErrorBanner'
import { Task } from '@/lib/types'

export default function CompletedPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setDbError(null)
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      if (!res.ok) { setDbError(data.error ?? 'Failed to fetch tasks'); return }
      setTasks(data.tasks)
    } catch {
      setDbError('Network error — could not reach the server.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#3D0026]">Completed</h1>
          <p className="text-sm text-[#C2185B]/60 mt-0.5">
            {completedCount} {completedCount === 1 ? 'task' : 'tasks'} completed 🎉
          </p>
        </div>

        {dbError ? (
          <DBErrorBanner message={dbError} />
        ) : (
          <>
            {!loading && completedCount > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-100 p-4 flex items-center gap-3 card-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">🏆</div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Amazing progress!</p>
                  <p className="text-xs text-emerald-600/70">
                    {completedCount} {completedCount === 1 ? 'task' : 'tasks'} down. Keep going!
                  </p>
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-pink-100 p-5 card-shadow">
              <TaskList tasks={tasks} loading={loading} filter="completed" onTasksChange={setTasks} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
