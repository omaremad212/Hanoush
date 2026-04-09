'use client'

import { useState } from 'react'

interface NamePromptProps {
  onSave: (name: string) => void
}

export default function NamePrompt({ onSave }: NamePromptProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter your name')
      return
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }
    localStorage.setItem('userName', trimmed)
    onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div className="animate-scale-in bg-white dark:bg-plum-dark rounded-2xl p-8 shadow-2xl w-full max-w-sm mx-4 border border-pink-200/60 dark:border-plum-light/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-plum to-mauve rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">✦</span>
          </div>
          <h2 className="font-playfair text-2xl font-bold text-plum dark:text-pink-200 mb-2">
            Welcome to Hanoush
          </h2>
          <p className="text-sm text-gray-500 dark:text-pink-300/60">
            Your personal luxury task manager
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-plum dark:text-pink-300 mb-1.5">
              What&apos;s your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="e.g. Sarah"
              className="input-base"
              autoFocus
              maxLength={50}
            />
            {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
          </div>
          <button type="submit" className="btn-primary w-full text-center">
            Let&apos;s get started ✨
          </button>
        </form>
      </div>
    </div>
  )
}
