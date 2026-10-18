import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

type Props = {
  variant?: 'full' | 'mark' | 'light'
  className?: string
}

export function Logo({ variant = 'mark', className }: Props) {
  const light = variant === 'light'

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2.5', className)}
      aria-label="Torxth Technology home"
    >
      <span
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-md sm:h-11 sm:w-11',
          light ? 'bg-white/10 ring-1 ring-white/15' : 'bg-ink',
        )}
      >
        <img src="/images/logo-t.svg" alt="" className="h-7 w-7 sm:h-8 sm:w-8" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-xl font-bold uppercase tracking-[0.1em] sm:text-2xl',
            light ? 'text-white' : 'text-ink',
          )}
        >
          Torxth
        </span>
        <span
          className={cn(
            'text-[0.62rem] font-medium uppercase tracking-[0.36em]',
            light ? 'text-signal-bright' : 'text-signal',
          )}
        >
          Technology
        </span>
      </span>
    </Link>
  )
}
