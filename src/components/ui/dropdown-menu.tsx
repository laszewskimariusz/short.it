"use client"
import * as React from 'react'

type Item = { label: string; onSelect: () => void }

export function DropdownMenu({ trigger, items }: { trigger: React.ReactNode; items: Item[] }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[160px] overflow-hidden rounded-md border border-white/10 bg-black/70 backdrop-blur-xl shadow-xl">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false)
                it.onSelect()
              }}
              className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10"
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
