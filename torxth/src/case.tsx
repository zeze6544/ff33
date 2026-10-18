import { useState } from 'react'
import { Link } from 'react-router-dom'

const parts = [
  {
    id: 'gpu',
    label: 'Graphics',
    title: 'The card that earns the case.',
    body: 'We size it to the games and the resolution you actually use. A quiet 1440p rig beats a loud 4K one you never needed.',
    href: '/build',
    cta: 'Open the editor',
    box: 'left-[8%] top-[46%] h-[28%] w-[62%]',
  },
  {
    id: 'cpu',
    label: 'Processor',
    title: 'Cool enough to forget it’s there.',
    body: 'The chip is the easy part. The cooler, the paste, and the fan curve are why it still sounds civil at midnight.',
    href: '/build',
    cta: 'Open the editor',
    box: 'left-[28%] top-[14%] h-[24%] w-[28%]',
  },
  {
    id: 'ram',
    label: 'Memory',
    title: 'Sixteen is a start. Thirty-two is peace.',
    body: 'Most “it’s slow” tickets we see are a full disk or not enough memory. We check both before we sell you a new tower.',
    href: '/shop',
    cta: 'See upgrade kits',
    box: 'left-[58%] top-[16%] h-[26%] w-[14%]',
  },
  {
    id: 'ssd',
    label: 'Storage',
    title: 'The drive is the whole feeling.',
    body: 'A tired hard disk makes a fine computer feel broken. We clone, swap, and check the copy before you leave.',
    href: '/services',
    cta: 'Book a drive swap',
    box: 'left-[74%] top-[18%] h-[22%] w-[16%]',
  },
  {
    id: 'psu',
    label: 'Power',
    title: 'The part nobody photographs.',
    body: 'Storms, cheap supplies, and mystery shutoffs. If it won’t post, we start here — and we don’t guess.',
    href: '/services',
    cta: 'Bring a dead machine',
    box: 'left-[8%] top-[78%] h-[14%] w-[40%]',
  },
] as const

type Id = (typeof parts)[number]['id']

export function OpenCase() {
  const [active, setActive] = useState<Id>('gpu')
  const part = parts.find((p) => p.id === active)!

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-blue">Open it</p>
          <h2 className="mt-2 max-w-lg text-4xl sm:text-5xl">Point at a part. We’ll tell you the truth about it.</h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-mute">
          A side of the case, the way it sits on the bench. Hover or tap a region.
        </p>
      </div>

      <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative aspect-[16/10] overflow-hidden bg-ink">
          <img
            src="/images/product-gaming-pc.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" aria-hidden>
            <rect x="36" y="28" width="520" height="344" rx="6" fill="none" stroke="#7ec8ee" strokeWidth="1.5" opacity="0.7" />
            <path d="M70 70 H250 M70 110 H210 M90 250 H430" stroke="#1A8FD0" strokeWidth="2" fill="none" opacity="0.8" />
            {[
              [120, 90],
              [250, 70],
              [430, 250],
              [160, 320],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#7ec8ee" />
            ))}
          </svg>
          {parts.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={active === p.id}
              onMouseEnter={() => setActive(p.id)}
              onFocus={() => setActive(p.id)}
              onClick={() => setActive(p.id)}
              className={`absolute ${p.box} border transition ${
                active === p.id
                  ? 'border-glow bg-blue/25 shadow-[0_0_0_1px_rgba(26,143,208,0.6)]'
                  : 'border-white/25 bg-white/5 hover:border-glow/70'
              }`}
            >
              <span className="absolute left-2 top-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white">
                {p.label}
              </span>
            </button>
          ))}
        </div>

        <article className="flex flex-col justify-between bg-sheet p-6 sm:p-8" aria-live="polite">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blue">{part.label}</p>
            <h3 className="mt-3 text-4xl">{part.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-mute">{part.body}</p>
          </div>
          <Link to={part.href} className="mt-8 inline-flex w-fit border-b border-blue pb-1 text-sm font-semibold text-blue">
            {part.cta} →
          </Link>
        </article>
      </div>
    </section>
  )
}
