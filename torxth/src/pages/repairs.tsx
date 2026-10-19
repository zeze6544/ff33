import { useState, type FormEvent } from 'react'
import { CheckCircle2, Mail, Phone } from 'lucide-react'
import { services } from '../data/services'
import { formatAUD } from '../data/products'
import { company } from '../data/company'
import { repairSteps } from '../copy'
import { useMeta } from '../meta'
import { Eyebrow, SectionHead } from '../components/ui'

export function RepairsPage() {
  useMeta('Repairs, upgrades & custom builds', 'Computer repairs from $79, upgrades, custom builds and software setup at Torxth Technology, Ferntree Gully. Quoted before work starts.')
  return (
    <div className="wrap py-10 lg:py-14">
      <Eyebrow>Repairs & services</Eyebrow>
      <div className="mt-2 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <h1 className="max-w-3xl text-4xl sm:text-5xl">Bring it in. We will tell you if it is worth fixing.</h1>
          <p className="mt-4 max-w-xl leading-relaxed text-mute">
            Every job is diagnosed and quoted before work starts. If a new machine is the honest answer, we will say that instead of selling you a repair.
          </p>
        </div>
        <a href="#book" className="btn-primary">
          Book a repair
        </a>
      </div>

      <div className="card mt-10 overflow-hidden">
        <h2 className="border-b border-line px-5 py-4 text-lg">Prices at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                <th scope="col" className="px-5 py-3 font-medium">Service</th>
                <th scope="col" className="px-5 py-3 font-medium">From</th>
                <th scope="col" className="px-5 py-3 font-medium">Typical timing</th>
                <th scope="col" className="px-5 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3.5 font-medium">{s.title}</td>
                  <td className="px-5 py-3.5 font-mono tabular-nums">{s.fromPrice != null ? formatAUD(s.fromPrice) : 'Quoted'}</td>
                  <td className="px-5 py-3.5 text-mute">{s.turnaround}</td>
                  <td className="px-5 py-3.5">
                    <a href={`#${s.slug}`} className="font-semibold text-blue">What is included</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-line px-5 py-3 text-xs text-mute">Parts are extra and quoted before fitting. Diagnostics are free when you go ahead with the repair.</p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {services.map((service) => (
          <article key={service.id} id={service.slug} className="card scroll-mt-28 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl">{service.title}</h2>
              {service.fromPrice != null && <p className="font-mono tabular-nums">from {formatAUD(service.fromPrice)}</p>}
            </div>
            <p className="mt-1 text-sm font-medium text-blue">{service.turnaround}</p>
            <p className="mt-3 leading-relaxed text-mute">{service.description}</p>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {service.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="mt-16">
        <SectionHead eyebrow="How it works" title="From dead machine to done" />
        <ol className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {repairSteps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-blue pt-4">
              <p className="font-mono text-sm text-blue">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-lg">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mute">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <Book />
    </div>
  )
}

function Book() {
  const [sent, setSent] = useState(false)
  const [mailto, setMailto] = useState('')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const lines = [
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Job: ${data.get('kind')}`,
      '',
      String(data.get('note') ?? ''),
    ]
    const href = `mailto:${company.email}?subject=${encodeURIComponent('Repair booking — Torxth')}&body=${encodeURIComponent(lines.join('\n'))}`
    setMailto(href)
    setSent(true)
    window.location.href = href
  }

  return (
    <section id="book" className="mt-16 scroll-mt-28 rounded-xl bg-ink p-6 text-white sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow light>Book it in</Eyebrow>
          <h2 className="mt-2 text-3xl">Tell us what it is doing</h2>
          <p className="mt-3 max-w-md leading-relaxed text-fog">
            This opens a pre-written email in your mail app — nothing is sent until you press send there. In a hurry, call the shop and describe it.
          </p>
          <a href={company.phoneHref} className="mt-5 inline-flex items-center gap-2 font-mono text-xl text-sky">
            <Phone className="h-5 w-5" aria-hidden />
            {company.phone}
          </a>
          {sent && (
            <p className="mt-5 rounded-lg border border-line-dark bg-panel px-4 py-3 text-sm text-fog" role="status">
              Your mail app should be open with the booking written. Did not open?{' '}
              <a href={mailto} className="font-semibold text-sky">Try again</a> or email {company.email}.
            </p>
          )}
        </div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label text-white">Name</span>
              <input name="name" required autoComplete="name" className="input border-line-dark bg-panel text-white placeholder:text-fog/60" />
            </label>
            <label className="block">
              <span className="field-label text-white">Phone</span>
              <input name="phone" type="tel" required autoComplete="tel" className="input border-line-dark bg-panel text-white placeholder:text-fog/60" />
            </label>
          </div>
          <label className="block">
            <span className="field-label text-white">What kind of job</span>
            <select name="kind" className="input border-line-dark bg-panel text-white" defaultValue="It broke — repair">
              <option>It broke — repair</option>
              <option>Make this one faster — upgrade</option>
              <option>Build me one — custom PC</option>
              <option>Software, accounts or a clean start</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label text-white">What is it doing?</span>
            <textarea name="note" required rows={4} placeholder="e.g. Laptop takes minutes to start, fan is loud, battery barely lasts the train ride…" className="w-full rounded-lg border border-line-dark bg-panel px-3 py-2.5 text-sm text-white outline-none placeholder:text-fog/60 focus:border-sky" />
          </label>
          <button type="submit" className="btn-primary w-fit">
            <Mail className="h-4 w-4" aria-hidden />
            Write the booking email
          </button>
        </form>
      </div>
    </section>
  )
}
