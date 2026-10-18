import { company } from '../data/company'
import { useMeta } from '../meta'

export function AboutPage() {
  useMeta('About the shop', 'Torxth Technology is a small computer business in Ferntree Gully, South East Melbourne.')
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="kicker text-blue">The shop</p>
          <h1 className="mt-2 text-5xl sm:text-6xl">Torxth Technology</h1>
          <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-mute">
            <p>
              A small computer business in South East Melbourne. Gamers, people who work from a spare room, and households that just want the printer to behave.
            </p>
            <p>
              The floor has machines you can take today. The bench has the ones that need a steady hand — virus cleanup, a new drive, a build specced to a budget instead of a brochure.
            </p>
            <p>
              You’ll talk to the person doing the work. That’s the whole pitch.
            </p>
          </div>
        </div>
        <img src="/images/service-repair.jpg" alt="Hands fitting a drive at the bench" className="plate aspect-[4/5] w-full object-cover" />
      </div>

      <dl className="mt-16 grid gap-8 border-t border-rule pt-8 sm:grid-cols-3">
        <div>
          <dt className="font-serif text-2xl">Advice</dt>
          <dd className="mt-2 text-sm leading-relaxed text-mute">
            Sometimes the right spend is a drive and more memory. We’ll say that out loud.
          </dd>
        </div>
        <div>
          <dt className="font-serif text-2xl">The bench</dt>
          <dd className="mt-2 text-sm leading-relaxed text-mute">
            New builds get cable-managed and left running before they leave Dorset Road.
          </dd>
        </div>
        <div>
          <dt className="font-serif text-2xl">After</dt>
          <dd className="mt-2 text-sm leading-relaxed text-mute">
            Twelve months on a new build. Ninety days on a refurb. Call if it misbehaves.
          </dd>
        </div>
      </dl>

      <p className="mt-12 text-lg">
        {company.address.full}
        <br />
        <a className="text-blue" href={company.phoneHref}>
          {company.phone}
        </a>
      </p>
    </div>
  )
}
