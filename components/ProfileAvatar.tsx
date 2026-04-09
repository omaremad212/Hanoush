'use client'

import Image from 'next/image'
import { getInitials } from '@/lib/utils'

interface ProfileAvatarProps {
  name: string
  photoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-16 h-16', text: 'text-xl' },
}

export default function ProfileAvatar({
  name,
  photoUrl,
  size = 'md',
  className = '',
}: ProfileAvatarProps) {
  const { container, text } = sizeMap[size]
  const initials = getInitials(name || 'U')

  return (
    <div
      className={`${container} rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ring-2 ring-mauve/40 ring-offset-1 ring-offset-cream dark:ring-offset-plum-deep ${className}`}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
          unoptimized
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-semibold ${text} bg-gradient-to-br from-rose-light to-mauve text-plum`}
        >
          {initials}
        </div>
      )}
    </div>
  )
}
