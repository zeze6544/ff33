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
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-brass">{kicker}</p>
          <h2 className="mt-1 font-serif text-2xl text-white sm:text-4xl">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={open}
          className="shrink-0 border border-white/20 px-3 py-2 text-xs font-semibold text-paper hover:border-brass"
        >
          {open ? 'Put the panel back' : 'Take the panel off'}
        </button>
      </div>
      <StageBoundary>
        <div
          className="h-[min(56vh,520px)] w-full border border-white/10"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 46%, #1c2a38 0%, #121a22 58%, #0d1318 100%)',
          }}
        >
          <CaseScene look={look} slot={slot} onSlot={onSlot} open={open} />
        </div>
      </StageBoundary>
      <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-fog">Drag to turn the case. Click a part.</p>
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
