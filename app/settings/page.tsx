'use client'

import { useEffect, useState, useRef } from 'react'
import AppShell from '@/components/AppShell'
import ProfileAvatar from '@/components/ProfileAvatar'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
})

type NameForm = z.infer<typeof nameSchema>

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
  })

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || ''
    const storedPhoto = localStorage.getItem('userPhoto')
    setName(storedName)
    setPhotoUrl(storedPhoto)
    reset({ name: storedName })
  }, [reset])

  const handleNameSave = (data: NameForm) => {
    localStorage.setItem('userName', data.name)
    setName(data.name)
    reset({ name: data.name })
    window.dispatchEvent(new Event('profileUpdated'))
    toast.success('Name updated!')
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WEBP image')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Upload failed')
      }

      const { url } = await res.json()
      setPhotoUrl(url)
      setPreview(null)
      localStorage.setItem('userPhoto', url)
      window.dispatchEvent(new Event('profileUpdated'))
      toast.success('Profile photo updated!')
    } catch (err: unknown) {
      setPreview(null)
      const msg = err instanceof Error ? err.message : 'Upload failed'
      toast.error(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = () => {
    setPhotoUrl(null)
    setPreview(null)
    localStorage.removeItem('userPhoto')
    window.dispatchEvent(new Event('profileUpdated'))
    toast.success('Profile photo removed')
  }

  const currentPhoto = preview || photoUrl

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-plum dark:text-pink-200">
            Settings
          </h1>
          <p className="text-sm text-mauve/70 dark:text-pink-300/50 mt-0.5">
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile Photo Card */}
        <div className="glass rounded-2xl p-6 card-shadow">
          <h2 className="font-playfair text-lg font-semibold text-plum dark:text-pink-200 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-plum/20 to-mauve/30 flex items-center justify-center text-sm">
              📷
            </span>
            Profile Photo
          </h2>

          <div className="flex items-center gap-5">
            <div className="relative">
              <ProfileAvatar
                name={name}
                photoUrl={currentPhoto}
                size="lg"
                className={uploading ? 'opacity-60' : ''}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                  <svg className="animate-spin w-6 h-6 text-plum" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-primary text-sm py-2 px-4"
                >
                  {photoUrl ? 'Change photo' : 'Upload photo'}
                </button>
                {(photoUrl || preview) && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={uploading}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-pink-400/40">
                JPG, PNG or WEBP · Max 2MB
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Display Name Card */}
        <div className="glass rounded-2xl p-6 card-shadow">
          <h2 className="font-playfair text-lg font-semibold text-plum dark:text-pink-200 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-plum/20 to-mauve/30 flex items-center justify-center text-sm">
              ✏️
            </span>
            Display Name
          </h2>

          <form onSubmit={handleSubmit(handleNameSave)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-plum dark:text-pink-300 mb-1.5">
                Your name
              </label>
              <input
                {...register('name')}
                placeholder="Enter your name"
                className="input-base max-w-sm"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.name.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary disabled:opacity-50"
              disabled={!isDirty}
            >
              Save name
            </button>
          </form>
        </div>

        {/* Danger zone — clear local storage */}
        <div className="glass rounded-2xl p-6 card-shadow border border-rose-200/40 dark:border-rose-800/20">
          <h2 className="font-playfair text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-sm">
              ⚠️
            </span>
            Reset Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-pink-300/50 mb-4">
            This will clear your name and profile photo from this device. Your tasks in the
            database will not be affected.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('userName')
              localStorage.removeItem('userPhoto')
              setName('')
              setPhotoUrl(null)
              reset({ name: '' })
              window.dispatchEvent(new Event('profileUpdated'))
              toast.success('Profile reset')
              setTimeout(() => window.location.reload(), 500)
            }}
            className="px-4 py-2 text-sm bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
          >
            Reset profile data
          </button>
        </div>
      </div>
    </AppShell>
  )
}
