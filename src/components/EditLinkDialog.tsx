"use client"
import { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  link: {
    id: string
    slug: string
    title: string | null
    isActive: boolean
    expiresAt: string | null
  }
  onUpdated: () => void
}

export default function EditLinkDialog({ open, onOpenChange, link, onUpdated }: Props) {
  const [alias, setAlias] = useState(link.slug)
  const [title, setTitle] = useState(link.title || '')
  const [expiresAt, setExpiresAt] = useState(link.expiresAt ? link.expiresAt.slice(0, 16) : '')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setAlias(link.slug)
      setTitle(link.title || '')
      setExpiresAt(link.expiresAt ? link.expiresAt.slice(0, 16) : '')
    }
  }, [open, link])

  async function save() {
    try {
      setLoading(true)
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias, title: title || null, expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ? JSON.stringify(j.error) : 'Failed to update')
      }
      toast({ title: 'Link updated' })
      onOpenChange(false)
      onUpdated()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit link"
      description="Update alias, title, or expiration."
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save'}</Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm text-white/80">Alias</label>
          <Input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="custom-alias" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional title" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Expires At</label>
          <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        </div>
      </div>
    </Dialog>
  )
}

