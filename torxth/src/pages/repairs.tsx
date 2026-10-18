import { useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { services } from '../data/services'
import { formatAUD } from '../data/products'
import { company } from '../data/company'
import { useMeta } from '../meta'

export function RepairsPage() {
  useMeta('Repairs & setup', 'Diagnostics, upgrades, custom builds and software from Torxth in Ferntree Gully.')
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blue">The bench</p>
      <h1 className="mt-2 max-w-2xl text-5xl sm:text-6xl">Bring it in. We’ll tell you if it’s worth it.</h1>
      <p className="mt-4 max-w-xl text-mute">
        Most jobs are quoted before a screwdriver turns. If a new machine is the honest answer, we’ll say so.
      </p>

      <ol className="mt-12 divide-y divide-rule border-y border-rule">
        {services.map((service, i) => (
          <li key={service.id} id={service.slug} className="grid gap-4 py-8 md:grid-cols-[8rem_1fr]">
            <p className="font-mono text-sm text-blue">0{i + 1}</p>
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-3xl">{service.title}</h2>
                {service.fromPrice != null && (
                  <span className="font-mono text-xs text-mute">from {formatAUD(service.fromPrice)}</span>
                )}
              </div>
              <p className="mt-3 max-w-2xl leading-relaxed text-mute">{service.description}</p>
              <ul className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
                {service.highlights.map((h) => (
                  <li key={h} className="before:mr-2 before:text-blue before:content-['–']">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <Book />
    </div>
  )
}

function Book() {
  const [sent, setSent] = useState(false)
  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }
  if (sent) {
    return (
      <p className="ticket mt-12 px-5 py-6 text-lg">
        Got it. If the machine won’t wait, call{' '}
        <a href={company.phoneHref} className="text-blue">
          {company.phone}
        </a>
        .
      </p>
    )
  }
  return (
    <form onSubmit={onSubmit} className="mt-12 grid max-w-xl gap-4">
      <h2 className="text-3xl">Leave it with us</h2>
      <Field label="Name" name="name" required />
      <Field label="Phone" name="phone" type="tel" required />
      <label className="block text-sm">
        What kind of job
        <select name="kind" className="mt-1 h-11 w-full border border-rule bg-sheet px-3" defaultValue="repair">
          <option value="repair">It broke</option>
          <option value="upgrade">Make this one faster</option>
          <option value="build">Build me one</option>
          <option value="software">Software, accounts, a clean start</option>
        </select>
      </label>
      <label className="block text-sm">
        What’s it doing
        <textarea required name="note" rows={4} className="mt-1 w-full border border-rule bg-sheet px-3 py-2" />
      </label>
      <button type="submit" className="w-fit bg-blue px-5 py-3 text-sm font-semibold text-white">
        Ask for a look
      </button>
    </form>
  )
}

function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      {label}
      <input {...props} className="mt-1 h-11 w-full border border-rule bg-sheet px-3" />
    </label>
  )
}
