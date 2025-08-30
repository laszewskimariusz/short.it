import * as React from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 disabled:pointer-events-none'
    const variants = {
      default: 'bg-white/10 hover:bg-white/15 text-white border border-white/10',
      outline: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
      ghost: 'bg-transparent text-white hover:bg-white/5',
      destructive: 'bg-red-600/80 hover:bg-red-600 text-white'
    }
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
      icon: 'h-10 w-10'
    }
    return (
      <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props} />
    )
  }
)
Button.displayName = 'Button'

