'use client'

import { useEffect, useState, useCallback } from 'react'
import AppShell from '@/components/AppShell'
import TaskList from '@/components/TaskList'
import DBErrorBanner from '@/components/DBErrorBanner'
import { Task } from '@/lib/types'
import toast from 'react-hot-toast'

export default function CompletedPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)

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

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-plum dark:text-pink-200">
            Completed
          </h1>
          <p className="text-sm text-mauve/70 dark:text-pink-300/50 mt-0.5">
            {completedCount} {completedCount === 1 ? 'task' : 'tasks'} completed — well done! 🎉
          </p>
        </div>

        {dbError ? (
          <DBErrorBanner message={dbError} />
        ) : (
          <>
            {!loading && completedCount > 0 && (
              <div className="glass rounded-2xl p-4 bg-gradient-to-r from-emerald-50/80 to-pink-50/80 dark:from-emerald-900/20 dark:to-plum-dark/40 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-lg">
                  🏆
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Amazing progress!
                  </p>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-500/60">
                    You&apos;ve completed {completedCount} {completedCount === 1 ? 'task' : 'tasks'} total. Keep it up!
                  </p>
                </div>
              </div>
            )}

            <div className="glass rounded-2xl p-5 card-shadow">
              <TaskList
                tasks={tasks}
                loading={loading}
                filter="completed"
                onTasksChange={setTasks}
              />
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
