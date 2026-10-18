import { useState, type FormEvent } from 'react'
import { company } from '../data/company'
import { useMeta } from '../meta'

export function VisitPage() {
  useMeta('Visit or write', `Torxth Technology, ${company.address.full}. Call ${company.phone}.`)
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="kicker text-blue">Find us</p>
        <h1 className="mt-2 text-5xl">The door’s on Dorset Road.</h1>
        <p className="mt-4 text-lg">
          {company.address.line1}
          <br />
          {company.address.suburb} {company.address.state} {company.address.postcode}
        </p>
        <a href={company.phoneHref} className="mt-3 inline-block font-serif text-3xl text-blue">
          {company.phone}
        </a>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">{company.hoursNote}</p>
        <div className="plate mt-6">
          <iframe
            title="Map to Torxth Technology"
            src={company.mapsEmbed}
            className="h-64 w-full grayscale"
            loading="lazy"
          />
        </div>
      </div>

      <div className="bg-sheet p-6 sm:p-8">
        {sent ? (
          <div>
            <h2 className="text-3xl">We’ll read it.</h2>
            <p className="mt-3 text-mute">If it’s on fire, don’t wait on email — call the shop.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <h2 className="text-3xl">A note</h2>
            <label className="block text-sm">
              Name
              <input required name="name" className="mt-1 h-11 w-full border border-rule bg-paper px-3" />
            </label>
            <label className="block text-sm">
              Email
              <input required type="email" name="email" className="mt-1 h-11 w-full border border-rule bg-paper px-3" />
            </label>
            <label className="block text-sm">
              About
              <select name="about" className="mt-1 h-11 w-full border border-rule bg-paper px-3" defaultValue="hello">
                <option value="hello">Just saying hello</option>
                <option value="repair">A repair</option>
                <option value="build">A build</option>
                <option value="order">Something on the shelf</option>
              </select>
            </label>
            <label className="block text-sm">
              Message
              <textarea required name="message" rows={5} className="mt-1 w-full border border-rule bg-paper px-3 py-2" />
            </label>
            <button type="submit" className="bg-ink px-5 py-3 text-sm font-semibold text-paper">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
