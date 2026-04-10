'use client'

import { useEffect, useRef, useState } from 'react'

const MESSAGES = [
  "Your content is going to change someone's day today! ✨",
  "استمري، أنتِ أقرب مما تتخيلي 🌸",
  "You're a creative queen, keep going! 👑",
  "كل خطوة صغيرة تقربك من حلمك 💕",
  "The world needs your unique voice! 🎀",
  "شغلك بيلمع، استمري في الإبداع 💫",
  "You show up every day — that's already a superpower 🌷",
  "محتواكِ بيفرق في حياة ناس كتير 🤍",
  "Rest if you need to, but don't you dare quit 🌙",
  "أنتِ مش بس content creator، أنتِ فنانة 🎨",
  "Every post you make is a little piece of magic ✨",
  "روحكِ الحلوة بتبان في كل حاجة بتعمليها 🌸",
  "You're building something beautiful — trust the process 💗",
  "اليوم ده هيكون أحسن من امبارح، واصلي 🌼",
  "Your ideas matter more than you know 💡",
  "أنتِ قادرة على أي حاجة تحطيها في بالك 🦋",
  "Small steps every day = big dreams one day 🚀",
  "الجمهور بينتظرك، أنتِ ما شاء الله عليكِ 💖",
  "You are exactly where you need to be right now 🌿",
  "طاقتكِ الإيجابية بتوصل لكل الناس 🌞",
  "Keep creating — the best is yet to come 🎀",
  "حلمك مش بعيد، هو بس في الطريق إليكِ 💫",
  "You inspire people without even realising it 🌹",
  "خذي نفس، أنتِ بتعملي رائع! 🌬️💕",
]

const INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

export default function MotivationalToasts() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [exiting, setExiting] = useState(false)
  const lastIndexRef = useRef(-1)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pickMessage = () => {
    let idx
    do {
      idx = Math.floor(Math.random() * MESSAGES.length)
    } while (idx === lastIndexRef.current)
    lastIndexRef.current = idx
    return MESSAGES[idx]
  }

  const show = () => {
    if (document.visibilityState !== 'visible') return
    setMessage(pickMessage())
    setExiting(false)
    setVisible(true)

    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    dismissTimer.current = setTimeout(() => dismiss(), 4000)
  }

  const dismiss = () => {
    setExiting(true)
    setTimeout(() => setVisible(false), 350)
  }

  useEffect(() => {
    const interval = setInterval(show, INTERVAL_MS)
    return () => {
      clearInterval(interval)
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] max-w-xs w-full pointer-events-auto ${
        exiting ? 'motivational-exit' : 'motivational-enter'
      }`}
    >
      <div
        className="relative flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-xl border border-pink-200/60"
        style={{
          background: 'linear-gradient(135deg, #fff0f7 0%, #ffe4f0 100%)',
          boxShadow: '0 8px 32px rgba(194,24,91,0.15), 0 2px 8px rgba(194,24,91,0.08)',
        }}
      >
        {/* Decorative glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-100/40 to-rose-100/20 pointer-events-none" />

        {/* Icon */}
        <span className="text-xl flex-shrink-0 mt-0.5 relative z-10">🌸</span>

        {/* Message */}
        <p className="text-sm font-medium text-[#7d1040] leading-snug relative z-10 flex-1">
          {message}
        </p>

        {/* Dismiss button */}
        <button
          onClick={dismiss}
          className="flex-shrink-0 text-pink-300 hover:text-pink-500 transition-colors relative z-10 mt-0.5"
          aria-label="Dismiss"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
