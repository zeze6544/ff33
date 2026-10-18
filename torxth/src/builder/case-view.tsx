import { Component, type ReactNode } from 'react'
import type { Look, Slot } from '../data/parts'
import { CaseScene } from './case-scene'

export function CaseView({
  look,
  slot,
  onSlot,
  open,
  onToggle,
  title,
  kicker,
}: {
  look: Look
  slot: Slot
  onSlot: (slot: Slot) => void
  open: boolean
  onToggle: () => void
  title: string
  kicker: string
}) {
  return (
    <div>
      <StageBoundary>
        <div className="relative h-[min(70vh,640px)] w-full overflow-hidden bg-[#10161c]">
          <CaseScene look={look} slot={slot} onSlot={onSlot} open={open} />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
            <div className="min-w-0 max-w-[34rem]">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-brass">{kicker}</p>
              <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl">{title}</h2>
            </div>
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={open}
              className="pointer-events-auto shrink-0 border border-white/20 bg-ink/70 px-3 py-2 text-xs font-semibold text-paper backdrop-blur-sm hover:border-brass"
            >
              {open ? 'Put the panel back' : 'Take the panel off'}
            </button>
          </div>
          <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-fog/80">
            Drag to turn the case. Click a part.
          </p>
        </div>
      </StageBoundary>
    </div>
  )
}

class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return <p className="bg-[#101820] px-4 py-16 text-sm text-fog">The case viewer needs WebGL in this browser.</p>
    }
    return this.props.children
  }
}
