import { useState, type FormEvent } from 'react'
import { company } from '../../data/company'
import { Button } from '../ui/Button'

export function BookingForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-line bg-white/60 px-6 py-10 sm:px-10">
        <h2 className="font-display text-2xl font-bold text-ink">Request received</h2>
        <p className="mt-3 text-steel">
          We will confirm a diagnostics slot shortly. For urgent issues call{' '}
          <a href={company.phoneHref} className="font-semibold text-ink">
            {company.phone}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-line bg-white/60 px-6 py-10 sm:px-10"
    >
      <h2 className="font-display text-2xl font-bold text-ink">Book a service</h2>
      <p className="mt-3 max-w-xl text-steel">
        Tell us the machine and the issue — we will confirm diagnostics and timing.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="text-sm font-medium">Name</span>
          <input
            required
            name="name"
            className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Phone</span>
          <input
            required
            type="tel"
            name="phone"
            className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Service type</span>
          <select
            name="service"
            className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
            defaultValue="repair"
          >
            <option value="repair">Repair / diagnostics</option>
            <option value="upgrade">Upgrade</option>
            <option value="build">Custom build consult</option>
            <option value="software">Software / setup</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">What is happening?</span>
          <textarea
            required
            name="issue"
            rows={4}
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
            placeholder="Laptop model, symptoms, any recent changes…"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" variant="signal" size="lg">
          Request booking
        </Button>
        <a
          href={company.phoneHref}
          className="inline-flex h-12 items-center rounded-md border border-line px-5 text-sm font-semibold text-ink hover:border-ink"
        >
          Or call {company.phone}
        </a>
      </div>
    </form>
  )
}
