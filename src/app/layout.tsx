import './globals.css'
import { ToastProvider } from '@/components/ui/toast'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Shorten.it — Simple URL Shortener',
  description: 'Shorten links with style and analytics.'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ensure session cookie path is consistent via SSR
  void headers()
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white antialiased">
        <ToastProvider>
          <Header sessionUser={session?.user ?? null} />
          <main className="container mx-auto px-4 pb-20 pt-10">{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}

