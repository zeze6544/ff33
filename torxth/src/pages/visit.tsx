import { useState, type FormEvent } from 'react'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { company } from '../data/company'
import { useMeta } from '../meta'
import { Eyebrow } from '../components/ui'

export function VisitPage() {
  useMeta('Visit or contact us', `Torxth Technology, ${company.address.full}. Call ${company.phone} or send a message.`)
  const [sent, setSent] = useState(false)
  const [mailto, setMailto] = useState('')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const lines = [`Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `About: ${data.get('about')}`, '', String(data.get('message') ?? '')]
    const href = `mailto:${company.email}?subject=${encodeURIComponent(`Message for Torxth — ${data.get('about')}`)}&body=${encodeURIComponent(lines.join('\n'))}`
    setMailto(href)
    setSent(true)
    window.location.href = href
  }

  return (
    <div className="wrap py-10 lg:py-14">
      <Eyebrow>Contact</Eyebrow>
      <h1 className="mt-2 max-w-2xl text-4xl sm:text-5xl">Call, visit, or send a note.</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <a href={company.phoneHref} className="card p-5 hover:border-blue">
          <Phone className="h-6 w-6 text-blue" aria-hidden />
          <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-mute">Call or text</p>
          <p className="mt-1 text-xl font-semibold">{company.phone}</p>
          <p className="mt-1 text-sm text-mute">Fastest for repairs and stock checks.</p>
        </a>
        <a href={company.mapUrl} target="_blank" rel="noreferrer" className="card p-5 hover:border-blue">
          <MapPin className="h-6 w-6 text-blue" aria-hidden />
          <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-mute">Visit</p>
          <p className="mt-1 text-xl font-semibold leading-snug">{company.address.full}</p>
          <p className="mt-1 text-sm text-mute">Tap for directions in Google Maps.</p>
        </a>
        <div className="card p-5">
          <Clock className="h-6 w-6 text-blue" aria-hidden />
          <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-mute">Hours</p>
          <p className="mt-1 text-xl font-semibold">Flexible, all week</p>
          <p className="mt-1 text-sm text-mute">Call or message first and we will be there.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <iframe
            title="Map to Torxth Technology, 61 Dorset Rd Ferntree Gully"
            src={company.mapsEmbed}
            className="h-full min-h-80 w-full rounded-xl border border-line"
            loading="lazy"
          />
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-2xl">
            <Mail className="h-5 w-5 text-blue" aria-hidden /> Send a message
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            This opens a pre-written email in your mail app — nothing sends until you press send there. Urgent? Call {company.phone} instead.
          </p>
          {sent && (
            <p className="mt-4 rounded-lg bg-okbg px-4 py-3 text-sm text-ok" role="status">
              Your mail app should be open with the message written.{' '}
              <a href={mailto} className="font-semibold underline">Open it again</a>
            </p>
          )}
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Name</span>
                <input required name="name" autoComplete="name" className="input" />
              </label>
              <label className="block">
                <span className="field-label">Email</span>
                <input required type="email" name="email" autoComplete="email" className="input" />
              </label>
            </div>
            <label className="block">
              <span className="field-label">About</span>
              <select name="about" className="input" defaultValue="A repair">
                <option>A repair</option>
                <option>A custom build</option>
                <option>Something in the shop</option>
                <option>An upgrade for my current PC</option>
                <option>Something else</option>
              </select>
            </label>
            <label className="block">
              <span className="field-label">Message</span>
              <textarea required name="message" rows={5} className="w-full rounded-lg border border-line bg-sheet px-3 py-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20" />
            </label>
            <button type="submit" className="btn-primary">
              <Mail className="h-4 w-4" aria-hidden />
              Write the email
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
