"use client"
import * as React from 'react'

type DialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
}

export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 text-white shadow-2xl">
        {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
        {description && <p className="text-white/70 mb-4 text-sm">{description}</p>}
        <div className="mb-4">{children}</div>
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
