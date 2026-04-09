'use client'

import { useEffect, useState, useRef } from 'react'
import AppShell from '@/components/AppShell'
import ProfileAvatar from '@/components/ProfileAvatar'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
})
type NameForm = z.infer<typeof nameSchema>

export default function SettingsPage() {
  const { data: session } = useSession()
  const [customName, setCustomName] = useState('')
  const [customPhoto, setCustomPhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
  })

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || ''
    const storedPhoto = localStorage.getItem('userPhoto') || null
    setCustomName(storedName)
    setCustomPhoto(storedPhoto)
    reset({ name: storedName || session?.user?.name || '' })
  }, [session, reset])

  const handleNameSave = (data: NameForm) => {
    localStorage.setItem('userName', data.name)
    setCustomName(data.name)
    reset({ name: data.name })
    window.dispatchEvent(new Event('profileUpdated'))
    toast.success('Display name updated!')
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WEBP image')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Upload failed')
      }
      const { url } = await res.json()
      setCustomPhoto(url)
      setPreview(null)
      localStorage.setItem('userPhoto', url)
      window.dispatchEvent(new Event('profileUpdated'))
      toast.success('Profile photo updated!')
    } catch (err) {
      setPreview(null)
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = () => {
    setCustomPhoto(null)
    setPreview(null)
    localStorage.removeItem('userPhoto')
    window.dispatchEvent(new Event('profileUpdated'))
    toast.success('Custom photo removed')
  }

  // What the topbar will show: custom > google
  const displayName = customName || session?.user?.name || 'User'
  const currentPhoto = preview || customPhoto || session?.user?.image || null

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#3D0026] dark:text-pink-50">Settings</h1>
          <p className="text-sm text-[#C2185B]/60 dark:text-pink-400/60 mt-0.5">Manage your profile and preferences</p>
        </div>

        {/* Google account info */}
        {session?.user && (
          <div className="bg-white dark:bg-[#3d0030] rounded-2xl border border-pink-100 dark:border-[#E91E8C]/15 p-5 card-shadow">
            <h2 className="font-playfair text-base font-semibold text-[#3D0026] dark:text-pink-50 mb-4 flex items-center gap-2">
              <span className="text-base">🔗</span> Google Account
            </h2>
            <div className="flex items-center gap-3">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="w-10 h-10 rounded-full ring-2 ring-pink-100 dark:ring-[#E91E8C]/20" />
              )}
              <div>
                <p className="text-sm font-semibold text-[#3D0026] dark:text-pink-100">{session.user.name}</p>
                <p className="text-xs text-gray-400 dark:text-pink-400/50">{session.user.email}</p>
              </div>
              <span className="ml-auto text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-700/30 px-2.5 py-1 rounded-full font-medium">
                ✓ Connected
              </span>
            </div>
          </div>
        )}

        {/* Profile Photo */}
        <div className="bg-white dark:bg-[#3d0030] rounded-2xl border border-pink-100 dark:border-[#E91E8C]/15 p-5 card-shadow">
          <h2 className="font-playfair text-base font-semibold text-[#3D0026] dark:text-pink-50 mb-4 flex items-center gap-2">
            <span>📷</span> Profile Photo
          </h2>
          <p className="text-xs text-gray-400 dark:text-pink-400/50 mb-4">
            Upload a custom photo to override your Google profile picture across the app.
          </p>
          <div className="flex items-center gap-5">
            <div className="relative">
              <ProfileAvatar
                name={displayName}
                photoUrl={currentPhoto}
                size="lg"
                className={uploading ? 'opacity-60' : ''}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                  <div className="w-6 h-6 rounded-full border-2 border-[#E91E8C] border-t-transparent animate-spin" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-primary text-sm py-2 px-4">
                  {customPhoto ? 'Change photo' : 'Upload photo'}
                </button>
                {customPhoto && (
                  <button onClick={handleRemovePhoto} disabled={uploading} className="btn-secondary text-sm py-2 px-4">
                    Use Google photo
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-pink-400/50">JPG, PNG or WEBP · Max 2MB</p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileSelect} />
        </div>

        {/* Display Name */}
        <div className="bg-white dark:bg-[#3d0030] rounded-2xl border border-pink-100 dark:border-[#E91E8C]/15 p-5 card-shadow">
          <h2 className="font-playfair text-base font-semibold text-[#3D0026] dark:text-pink-50 mb-4 flex items-center gap-2">
            <span>✏️</span> Display Name
          </h2>
          <p className="text-xs text-gray-400 dark:text-pink-400/50 mb-4">
            Override your Google name with a custom display name shown in the greeting.
          </p>
          <form onSubmit={handleSubmit(handleNameSave)} className="space-y-3">
            <div>
              <input
                {...register('name')}
                placeholder={session?.user?.name ?? 'Your display name'}
                className="input-base max-w-sm"
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={!isDirty}>
                Save name
              </button>
              {customName && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('userName')
                    setCustomName('')
                    reset({ name: session?.user?.name ?? '' })
                    window.dispatchEvent(new Event('profileUpdated'))
                    toast.success('Reset to Google name')
                  }}
                  className="btn-secondary"
                >
                  Reset to Google name
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  )
}
