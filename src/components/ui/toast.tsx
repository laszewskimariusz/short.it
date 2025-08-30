"use client";

"use client"
import * as React from 'react'

type Toast = { id: number; title?: string; description?: string; variant?: 'default' | 'destructive' }

const ToastCtx = React.createContext<{
  toasts: Toast[]
  show: (t: Omit<Toast, 'id'>) => void
  hide: (id: number) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const show = (t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, ...t }])
    setTimeout(() => hide(id), 3000)
  }
  const hide = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))
  return (
    <ToastCtx.Provider value={{ toasts, show, hide }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[220px] rounded-md border px-4 py-3 text-sm shadow-xl backdrop-blur-xl ${
              t.variant === 'destructive'
                ? 'bg-red-600/80 border-red-400/40 text-white'
                : 'bg-black/70 border-white/10 text-white'
            }`}
          >
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-white/80">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return { toast: ctx.show }
}
