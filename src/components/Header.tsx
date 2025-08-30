"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export default function Header({ sessionUser }: { sessionUser: { id: string; email?: string | null } | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Shorten.it
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/dashboard" className="text-white/80 hover:text-white">
            Dashboard
          </Link>
          {sessionUser ? (
            <Button onClick={() => signOut({ callbackUrl: '/' })} variant="outline" size="sm">
              Sign out
            </Button>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="outline" size="sm">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

