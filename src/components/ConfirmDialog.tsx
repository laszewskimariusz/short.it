"use client"
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm'
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description?: string
  onConfirm: () => void
  confirmText?: string
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false) }}>{confirmText}</Button>
        </>
      }
    />
  )
}

