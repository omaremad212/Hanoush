'use client'

import { useState } from 'react'
import { Task } from '@/lib/types'
import toast from 'react-hot-toast'

interface AISuggestModalProps {
  task: Task
  onClose: () => void
}

export default function AISuggestModal({ task, onClose }: AISuggestModalProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const getSuggestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
        }),
      })
      if (!res.ok) throw new Error('Failed to get suggestions')
      const data = await res.json()
      setSuggestions(data.suggestions)
      setLoaded(true)
    } catch {
      toast.error('Could not get AI suggestions. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div
        className="animate-scale-in bg-white dark:bg-plum-dark w-full max-w-lg rounded-2xl shadow-2xl border border-pink-200/60 dark:border-plum-light/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-pink-100 dark:border-plum-light/20 bg-gradient-to-r from-plum/5 to-mauve/10 dark:from-plum/20 dark:to-mauve/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-plum to-mauve flex items-center justify-center shadow-sm">
              <span className="text-white text-sm">✨</span>
            </div>
            <div>
              <h2 className="font-playfair text-base font-bold text-plum dark:text-pink-200">
                AI Suggestions
              </h2>
              <p className="text-xs text-mauve/70 dark:text-pink-300/50">Powered by Claude</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-pink-100 dark:hover:bg-plum-light/20 transition-colors text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Task context */}
        <div className="px-6 py-4 bg-pink-50/60 dark:bg-plum-deep/30 border-b border-pink-100 dark:border-plum-light/10">
          <p className="text-xs font-semibold text-mauve/60 dark:text-pink-400/50 uppercase tracking-wider mb-1">
            Task
          </p>
          <p className="text-sm font-semibold text-plum dark:text-pink-200">{task.title}</p>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-pink-300/50 mt-0.5 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!loaded && !loading && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-pink-300/60 mb-4">
                Let Claude break down this task into actionable steps for you.
              </p>
              <button onClick={getSuggestions} className="btn-primary">
                ✨ Generate Subtasks
              </button>
            </div>
          )}

          {loading && (
            <div className="space-y-3 py-2">
              <p className="text-sm text-center text-mauve/70 dark:text-pink-300/60 mb-3 animate-pulse">
                Claude is thinking...
              </p>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="skeleton w-5 h-5 rounded-full mt-0.5 flex-shrink-0" />
                  <div className="skeleton h-4 rounded flex-1" style={{ width: `${70 + i * 8}%` }} />
                </div>
              ))}
            </div>
          )}

          {loaded && suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-mauve/60 dark:text-pink-400/50 uppercase tracking-wider mb-3">
                Suggested Steps
              </p>
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="animate-slide-up flex items-start gap-3 p-3 rounded-xl bg-pink-50/80 dark:bg-plum-deep/40 border border-pink-100 dark:border-plum-light/10"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-plum to-mauve text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-pink-200/80 leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              ))}
              <button
                onClick={getSuggestions}
                className="w-full mt-3 text-xs text-mauve/60 hover:text-plum dark:text-pink-400/50 dark:hover:text-pink-300 transition-colors py-2"
              >
                ↻ Regenerate suggestions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
