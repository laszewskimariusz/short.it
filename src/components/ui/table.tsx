import * as React from 'react'

export function Table({ className = '', ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-sm ${className}`} {...props} />
    </div>
  )
}

export function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="text-left text-white/70" {...props} />
}

export function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="divide-y divide-white/10" {...props} />
}

export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="hover:bg-white/5" {...props} />
}

export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-4 py-3 font-medium" {...props} />
}

export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-4 py-3 align-middle" {...props} />
}

