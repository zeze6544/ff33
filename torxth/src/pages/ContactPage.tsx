import { useState, type FormEvent } from 'react'
import { company } from '../data/company'
import { Button } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

export function ContactPage() {
  usePageTitle('Contact')
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          Contact
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Talk to Torxth
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel sm:text-lg">
          Questions about a build, a repair, or an order from the shop? Reach
          out — we are based at {company.address.full}.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <dl className="space-y-6">
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-steel">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href={company.phoneHref}
                    className="font-display text-2xl font-bold text-ink hover:text-signal"
                  >
                    {company.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-steel">
                  Address
                </dt>
                <dd className="mt-1 text-base text-ink">
                  {company.address.line1}
                  <br />
                  {company.address.suburb} {company.address.state}{' '}
                  {company.address.postcode}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-steel">
                  Hours
                </dt>
                <dd className="mt-1 text-base text-steel">{company.hoursNote}</dd>
              </div>
            </dl>

            <div className="mt-8 overflow-hidden rounded-lg border border-line">
              <iframe
                title="Map to Torxth Technology"
                src={company.mapsEmbed}
                className="h-64 w-full border-0 grayscale-[30%] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white/60 p-6 sm:p-8">
            {sent ? (
              <div className="flex min-h-64 flex-col justify-center">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Message received
                </h2>
                <p className="mt-3 text-steel">
                  Thanks — we will get back to you shortly. For urgent repairs,
                  call{' '}
                  <a href={company.phoneHref} className="font-semibold text-ink">
                    {company.phone}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Send a message
                </h2>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Name</span>
                  <input
                    required
                    name="name"
                    className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Topic</span>
                  <select
                    name="topic"
                    className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
                    defaultValue="general"
                  >
                    <option value="general">General enquiry</option>
                    <option value="repair">Repair / upgrade</option>
                    <option value="build">Custom build</option>
                    <option value="shop">Shop order</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Message</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                </label>
                <Button type="submit" variant="copper" size="lg" className="w-full sm:w-auto">
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
