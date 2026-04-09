'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/lib/types'
import { formatDate, isOverdue, cn } from '@/lib/utils'
import PriorityBadge from './PriorityBadge'

interface TaskCardProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onAISuggest: (task: Task) => void
}

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onAISuggest,
}: TaskCardProps) {
  const [toggling, setToggling] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const overdue = !task.completed && isOverdue(task.dueDate)

  const handleToggle = async () => {
    setToggling(true)
    await onToggle(task.id, !task.completed)
    setToggling(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'glass rounded-2xl p-4 card-shadow group transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        task.completed && 'opacity-70',
        isDragging && 'shadow-lg scale-105 z-50',
        overdue && !task.completed && 'ring-1 ring-rose-300/60 dark:ring-rose-700/40'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-300 dark:text-pink-400/30 hover:text-mauve dark:hover:text-mauve transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM15 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM9 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM15 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM9 16.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM15 16.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
          </svg>
        </button>

        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-0.5',
            task.completed
              ? 'bg-gradient-to-br from-plum to-mauve border-transparent animate-checkmark'
              : 'border-pink-300 dark:border-plum-light/40 hover:border-mauve dark:hover:border-mauve',
            toggling && 'opacity-50'
          )}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                'text-sm font-semibold text-gray-800 dark:text-pink-100 leading-snug',
                task.completed && 'task-complete'
              )}
            >
              {task.title}
            </p>
            {/* Actions - visible on hover */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onAISuggest(task)}
                title="AI Suggest"
                className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-plum-light/20 text-purple-400 hover:text-purple-600 dark:text-mauve/50 dark:hover:text-mauve transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(task)}
                title="Edit"
                className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-400 hover:text-blue-600 dark:text-blue-400/50 dark:hover:text-blue-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task)}
                title="Delete"
                className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/20 text-rose-400 hover:text-rose-600 dark:text-rose-400/50 dark:hover:text-rose-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 dark:text-pink-300/50 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <PriorityBadge priority={task.priority} />

            {task.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                  overdue
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-plum-deep/40 dark:text-pink-300/60'
                )}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton loader
export function TaskCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-4 card-shadow">
      <div className="flex items-start gap-3">
        <div className="skeleton w-5 h-5 rounded-full mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 rounded w-3/4" />
          <div className="skeleton h-3 rounded w-1/2" />
          <div className="flex gap-2 mt-2">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
