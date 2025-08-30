import * as React from 'react'

export function Badge({ color = 'green', children }: { color?: 'green' | 'red' | 'gray'; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    gray: 'bg-white/10 text-white/80 border-white/20'
  }
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${colors[color]}`}>{children}</span>
}

