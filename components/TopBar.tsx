'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProfileAvatar from './ProfileAvatar'
import DarkModeToggle from './DarkModeToggle'
import { getGreeting, getTodayFormatted } from '@/lib/utils'

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [greeting, setGreeting] = useState('')
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    setName(localStorage.getItem('userName') || 'there')
    setPhotoUrl(localStorage.getItem('userPhoto'))
    setGreeting(getGreeting())
    setDateStr(getTodayFormatted())
  }, [])

  // Listen for profile updates
  useEffect(() => {
    const handler = () => {
      setName(localStorage.getItem('userName') || 'there')
      setPhotoUrl(localStorage.getItem('userPhoto'))
    }
    window.addEventListener('profileUpdated', handler)
    return () => window.removeEventListener('profileUpdated', handler)
  }, [])

  return (
    <header className="sticky top-0 z-10 glass border-b border-pink-200/60 dark:border-plum-light/20 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: hamburger + greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-pink-100 dark:hover:bg-plum-dark/50 transition-colors text-plum dark:text-pink-300"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="font-playfair text-base md:text-lg font-semibold text-plum dark:text-pink-200 truncate">
              {greeting}, {name} 🌸
            </h1>
            <p className="text-xs text-mauve/70 dark:text-pink-300/50 hidden sm:block">{dateStr}</p>
          </div>
        </div>

        {/* Right: dark mode + avatar */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <DarkModeToggle />
          <Link href="/settings" className="hover:opacity-80 transition-opacity">
            <ProfileAvatar name={name} photoUrl={photoUrl} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  )
}
