'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Task, TaskFormData } from '@/lib/types'
import { formatDateInput } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

interface TaskFormModalProps {
  mode: 'add' | 'edit'
  task?: Task | null
  onClose: () => void
  onSubmit: (data: TaskFormData) => Promise<void>
  loading?: boolean
}

export default function TaskFormModal({
  mode,
  task,
  onClose,
  onSubmit,
  loading,
}: TaskFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      dueDate: task?.dueDate ? formatDateInput(task.dueDate) : '',
      priority: task?.priority ?? 'MEDIUM',
    },
  })

  useEffect(() => {
    if (mode === 'edit' && task) {
      reset({
        title: task.title,
        description: task.description ?? '',
        dueDate: task.dueDate ? formatDateInput(task.dueDate) : '',
        priority: task.priority,
      })
    }
  }, [task, mode, reset])

  const title = mode === 'add' ? 'New Task' : 'Edit Task'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div
        className="animate-scale-in bg-white dark:bg-plum-dark w-full max-w-lg rounded-2xl shadow-2xl border border-pink-200/60 dark:border-plum-light/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-pink-100 dark:border-plum-light/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-plum to-mauve flex items-center justify-center">
              <span className="text-white text-xs">
                {mode === 'add' ? '+' : '✏'}
              </span>
            </div>
            <h2 className="font-playfair text-lg font-bold text-plum dark:text-pink-200">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-pink-100 dark:hover:bg-plum-light/20 transition-colors text-gray-400 dark:text-pink-400/60"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-plum dark:text-pink-300 mb-1.5">
              Task title <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('title')}
              placeholder="What do you need to do?"
              className="input-base"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-plum dark:text-pink-300 mb-1.5">
              Description
            </label>
            <textarea
              {...register('description')}
              placeholder="Add more details (optional)"
              rows={3}
              className="input-base resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-plum dark:text-pink-300 mb-1.5">
                Due date
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-plum dark:text-pink-300 mb-1.5">
                Priority
              </label>
              <select {...register('priority')} className="input-base">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : mode === 'add' ? (
                'Add Task ✨'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
