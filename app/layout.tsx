import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SessionProvider from '@/components/SessionProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hanoush — Content Creator Dashboard',
  description: 'Your personal luxury task manager for content creators',
  icons: { icon: '/avatar.jpg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} font-dm antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#3D0026',
              border: '1px solid #FFB6C1',
              borderRadius: '14px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              boxShadow: '0 4px 20px rgba(194,24,91,0.10)',
            },
            success: {
              iconTheme: { primary: '#C2185B', secondary: '#ffffff' },
            },
          }}
        />
      </body>
    </html>
  )
}
