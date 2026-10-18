import { services } from '../data/services'
import { formatAUD } from '../data/products'
import { usePageTitle } from '../hooks/usePageTitle'
import { BookingForm } from '../components/services/BookingForm'

export function ServicesPage() {
  usePageTitle('Services')
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          Workshop services
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Repairs, upgrades, custom builds & software
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel sm:text-lg">
          Torxth Technology helps gamers, professionals and everyday users across
          Ferntree Gully and South East Melbourne. Clear quotes, quality parts,
          and technicians who stay with the job until it works.
        </p>

        <div className="mt-14 space-y-16">
          {services.map((service, index) => (
            <article
              key={service.id}
              id={service.slug}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="overflow-hidden rounded-lg bg-mist-deep">
                <img
                  src={
                    service.image ||
                    (index % 2 === 0
                      ? '/images/service-repair.jpg'
                      : '/images/product-gaming-pc.jpg')
                  }
                  alt=""
                  className="aspect-[5/4] w-full object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="font-display text-3xl font-bold text-ink">
                    {service.title}
                  </h2>
                  {service.fromPrice != null && (
                    <span className="font-mono text-xs text-steel">
                      from {formatAUD(service.fromPrice)}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-base leading-relaxed text-steel">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {service.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-ink before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-signal before:content-['']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <BookingForm />
        </div>
      </div>
    </div>
  )
}
