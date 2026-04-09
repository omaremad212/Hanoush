'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [status, router])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#FFF0F3] dark:bg-[#1a0011] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E91E8C] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF0F3] dark:bg-[#1a0011] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FFB6C1]/30 dark:bg-[#E91E8C]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#F8BBD9]/30 dark:bg-[#C2185B]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#E91E8C]/5 blur-3xl hidden dark:block" />
      </div>

      <div className="relative bg-white dark:bg-[#2d0020] rounded-3xl p-10 shadow-xl dark:shadow-2xl border border-pink-100 dark:border-[#E91E8C]/20 w-full max-w-sm text-center animate-scale-in">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-[#C2185B] to-[#E91E8C] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-2xl">✦</span>
        </div>

        <h1 className="font-playfair text-3xl font-bold text-[#3D0026] dark:text-pink-50 mb-1">Hanoush</h1>
        <p className="text-sm text-[#C2185B]/70 dark:text-[#E91E8C]/80 font-medium mb-8 tracking-wide">
          Content Creator Dashboard
        </p>

        <p className="text-sm text-gray-500 dark:text-pink-300/60 mb-6 leading-relaxed">
          Sign in to access your personal task manager. Your data stays private and syncs across all your devices.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-[#3d0030] border-2 border-[#FFB6C1] dark:border-[#E91E8C]/25 hover:border-[#C2185B] dark:hover:border-[#E91E8C]/60 hover:bg-[#FFF0F3] dark:hover:bg-[#4d003c] text-[#3D0026] dark:text-pink-100 font-semibold rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#E91E8C] border-t-transparent animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="text-xs text-gray-400 dark:text-pink-400/40 mt-8">
          Your tasks, beautifully organized ✨
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
