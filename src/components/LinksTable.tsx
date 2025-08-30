"use client"
import { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/toast'
import EditLinkDialog from '@/components/EditLinkDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import dayjs from 'dayjs'

type Link = {
  id: string
  slug: string
  originalUrl: string
  title: string | null
  isActive: boolean
  clicks: number
  createdAt: string
  expiresAt: string | null
}

export default function LinksTable() {
  const [items, setItems] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState<Link | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Link | null>(null)
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    const res = await fetch('/api/links')
    const data = await res.json()
    setItems(data.items)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const base = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="glass overflow-hidden">
      <Table>
        <Thead>
          <Tr>
            <Th>Short URL</Th>
            <Th>Original</Th>
            <Th>Clicks</Th>
            <Th>Created</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr><Td colSpan={6} className="text-center py-8 text-white/70">Loading…</Td></Tr>
          ) : items.length === 0 ? (
            <Tr><Td colSpan={6} className="text-center py-8 text-white/70">No links yet.</Td></Tr>
          ) : (
            items.map((l) => {
              const short = `${base}/r/${l.slug}`
              const inactive = !l.isActive || (l.expiresAt && new Date(l.expiresAt) <= new Date())
              return (
                <Tr key={l.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <a href={short} target="_blank" className="underline decoration-white/30">{short}</a>
                      <Button size="sm" variant="ghost" onClick={async () => { await navigator.clipboard.writeText(short); toast({ title: 'Copied' }) }}>Copy</Button>
                    </div>
                    {l.title && <div className="text-xs text-white/60">{l.title}</div>}
                  </Td>
                  <Td title={l.originalUrl} className="max-w-[300px] truncate">
                    <a href={l.originalUrl} target="_blank" className="text-white/80 hover:text-white">{l.originalUrl}</a>
                  </Td>
                  <Td>{l.clicks}</Td>
                  <Td>{dayjs(l.createdAt).format('YYYY-MM-DD')}</Td>
                  <Td>{inactive ? <Badge color="red">Inactive</Badge> : <Badge color="green">Active</Badge>}</Td>
                  <Td>
                    <DropdownMenu
                      trigger={<Button size="sm" variant="outline">Actions</Button>}
                      items={[
                        { label: 'Open', onSelect: () => window.open(short, '_blank') },
                        { label: 'Edit', onSelect: () => setEdit(l) },
                        {
                          label: l.isActive ? 'Deactivate' : 'Activate',
                          onSelect: async () => {
                            const res = await fetch(`/api/links/${l.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !l.isActive }) })
                            if (res.ok) { toast({ title: 'Updated' }); load() } else { toast({ title: 'Failed', variant: 'destructive' }) }
                          }
                        },
                        {
                          label: 'QR Code',
                          onSelect: async () => {
                            const url = `/api/links/${l.id}/qrcode`
                            const w = window.open('', '_blank')
                            if (w) {
                              w.document.write(`<html><head><title>QR</title></head><body style="background:#0b0f1a;color:#fff;display:grid;place-items:center;height:100vh"><img src="${url}" alt="QR"/></body></html>`)
                            }
                          }
                        },
                        { label: 'Delete', onSelect: () => setConfirmDelete(l) }
                      ]}
                    />
                  </Td>
                </Tr>
              )
            })
          )}
        </Tbody>
      </Table>

      {edit && (
        <EditLinkDialog open={!!edit} onOpenChange={() => setEdit(null)} link={edit} onUpdated={load} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          open={!!confirmDelete}
          onOpenChange={() => setConfirmDelete(null)}
          title="Delete link?"
          description="This action cannot be undone."
          confirmText="Delete"
          onConfirm={async () => {
            await fetch(`/api/links/${confirmDelete.id}`, { method: 'DELETE' })
            toast({ title: 'Deleted' })
            load()
          }}
        />
      )}
    </div>
  )
}

