import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'copper' | 'signal'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-paper hover:bg-ink-soft shadow-[0_10px_30px_-12px_rgba(16,32,48,0.55)]',
  secondary:
    'bg-transparent text-ink border border-line hover:border-ink hover:bg-white/50',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  copper:
    'bg-signal text-white hover:bg-signal-deep shadow-[0_12px_28px_-14px_rgba(0,112,176,0.65)]',
  signal:
    'bg-signal text-white hover:bg-signal-deep shadow-[0_12px_28px_-14px_rgba(0,112,176,0.65)]',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-12 px-7 text-base',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
