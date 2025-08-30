"use client"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

export default function ShortenForm({ authenticated }: { authenticated: boolean }) {
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  async function handleShorten() {
    if (!authenticated) {
      setOpen(true)
      return
    }
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url, alias: alias || undefined })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ? JSON.stringify(j.error) : 'Failed to shorten')
      }
      const data = await res.json()
      const short = `${window.location.origin}/r/${data.slug}`
      await navigator.clipboard.writeText(short)
      toast({ title: 'Short link copied', description: short })
      setUrl(''); setAlias('')
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="https://example.com/very/long/url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        aria-label="Original URL"
      />
      <Input
        placeholder="custom-alias (optional)"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        aria-label="Custom alias"
        className="sm:max-w-[220px]"
      />
      <Button onClick={handleShorten} className="sm:w-auto w-full">Shorten</Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Sign in required"
        description="Create an account or sign in to shorten links."
        footer={
          <div className="flex gap-2">
            <a href={`/signup?url=${encodeURIComponent(url)}`} className="inline-flex">
              <Button>Sign up</Button>
            </a>
            <a href={`/signin?callbackUrl=/dashboard`} className="inline-flex">
              <Button variant="outline">Sign in</Button>
            </a>
          </div>
        }
      >
        <p className="text-sm text-white/80">We’ll remember your links and analytics.</p>
      </Dialog>
    </div>
  )
}

