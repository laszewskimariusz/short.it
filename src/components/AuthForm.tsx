"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const sp = useSearchParams()
  const callbackUrl = sp.get('callbackUrl') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        // Call API to create the user
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || 'Failed to sign up')
        }
      }
      const res = await signIn('credentials', { email, password, redirect: false, callbackUrl })
      if (res?.error) {
        if (res.error === 'CredentialsSignin') throw new Error('Invalid email or password')
        throw new Error(res.error)
      }
      window.location.href = callbackUrl
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-white/80" htmlFor="email">Email</label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-white/80" htmlFor="password">Password</label>
        <div className="relative">
          <Input id="password" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/70">
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
      <div className="text-center text-sm text-white/70">
        {mode === 'signin' ? (
          <>No account? <Link href="/signup" className="text-white">Sign up</Link></>
        ) : (
          <>Have an account? <Link href="/signin" className="text-white">Sign in</Link></>
        )}
      </div>
    </form>
  )
}
