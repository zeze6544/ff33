import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, HardDrive, Keyboard, MemoryStick, Monitor, ShieldCheck } from 'lucide-react'
import { availabilityLabels, formatAUD, type Product, type ProductAvailability } from '../data/products'
import { useCart } from '../hooks/useCart'

export function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p className={`font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] ${light ? 'text-sky' : 'text-blue'}`}>
      {children}
    </p>
  )
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  light = false,
  action,
}: {
  eyebrow: string
  title: string
  intro?: string
  light?: boolean
  action?: { to: string; label: string }
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2 className={`mt-2 text-3xl sm:text-4xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
        {intro && <p className={`mt-3 leading-relaxed ${light ? 'text-fog' : 'text-mute'}`}>{intro}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold ${light ? 'text-sky hover:text-white' : 'text-blue hover:text-blue-deep'}`}
        >
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}

export function StockPill({ availability }: { availability: ProductAvailability }) {
  if (availability === 'in_shop') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-okbg px-2.5 py-1 text-xs font-semibold text-ok">
        <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
        {availabilityLabels.in_shop}
      </span>
    )
  }
  if (availability === 'built_to_order') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky/15 px-2.5 py-1 text-xs font-semibold text-blue">
        <span className="h-1.5 w-1.5 rounded-full bg-blue" aria-hidden />
        {availabilityLabels.built_to_order}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warnbg px-2.5 py-1 text-xs font-semibold text-warn">
      <span className="h-1.5 w-1.5 rounded-full bg-warn" aria-hidden />
      {availabilityLabels.order_in}
    </span>
  )
}

export function Price({ value, compareAt, large = false }: { value: number; compareAt?: number; large?: boolean }) {
  return (
    <span className="inline-flex flex-col items-start gap-0.5">
      <span className="inline-flex flex-wrap items-baseline gap-x-2">
        <span className={`font-mono font-medium tabular-nums ${large ? 'text-3xl' : 'text-lg'}`}>{formatAUD(value)}</span>
        {compareAt && compareAt > value && (
          <span className="font-mono text-sm tabular-nums text-mute line-through">{formatAUD(compareAt)}</span>
        )}
      </span>
      <span className={`font-mono uppercase tracking-[0.12em] text-mute ${large ? 'text-[0.7rem]' : 'text-[0.6rem]'}`}>
        AUD · inc. GST
      </span>
    </span>
  )
}

/** Photo for machines; a labelled spec tile for parts/software so the picture always matches the product. */
export function ProductVisual({ product, className = '' }: { product: Product; className?: string }) {
  if (product.category === 'components' || product.category === 'software') {
    const Icon =
      product.category === 'software'
        ? product.id.includes('security')
          ? ShieldCheck
          : Monitor
        : product.id.includes('ram')
          ? MemoryStick
          : HardDrive
    return (
      <div className={`spec-grid relative flex items-center justify-center overflow-hidden bg-ink-2 ${className}`} role="img" aria-label={product.name}>
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <Icon className="h-12 w-12 text-sky" strokeWidth={1.25} aria-hidden />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-fog">
            {product.specs[0] ? `${product.specs[0].label} · ${product.specs[0].value}` : product.shortName}
          </span>
        </div>
      </div>
    )
  }
  if (product.category === 'peripherals' && product.id !== 'tx-copper-kit') {
    return (
      <div className={`spec-grid relative flex items-center justify-center overflow-hidden bg-ink-2 ${className}`} role="img" aria-label={product.name}>
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <Keyboard className="h-12 w-12 text-sky" strokeWidth={1.25} aria-hidden />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-fog">{product.shortName}</span>
        </div>
      </div>
    )
  }
  return <img src={product.image} alt={product.name} loading="lazy" className={`object-cover ${className}`} />
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-[0_16px_40px_-20px_rgba(10,20,31,0.35)]">
      <Link to={`/shop/${product.slug}`} className="block overflow-hidden bg-ink-2" aria-label={product.name}>
        <ProductVisual product={product} className="aspect-[16/10] w-full transition duration-500 group-hover:scale-[1.03]" />
      </Link>
      {product.imageNote && product.category !== 'components' && product.category !== 'software' && (
        <p className="border-b border-line bg-paper px-5 py-2 text-[0.7rem] leading-snug text-mute">{product.imageNote}</p>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-blue">{product.badge ?? product.shortName}</p>
          <StockPill availability={product.availability} />
        </div>
        <Link to={`/shop/${product.slug}`}>
          <h3 className="mt-2 text-xl leading-snug group-hover:text-blue">{product.name}</h3>
        </Link>
        <p className="mt-1.5 text-sm leading-relaxed text-mute">{product.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.specs.slice(0, 3).map((s) => (
            <span key={s.label} className="chip">
              {s.label} {s.value}
            </span>
          ))}
        </div>
        <div className="flex-1" />
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <Price value={product.price} compareAt={product.compareAt} />
          <button
            type="button"
            onClick={() => addItem(product.id, 1)}
            className="inline-flex min-h-11 items-center rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-blue"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export function TrustItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky" aria-hidden />
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-fog">{text}</p>
      </div>
    </div>
  )
}

export function Faq({ items, light = false }: { items: { q: string; a: string }[]; light?: boolean }) {
  return (
    <div className={`divide-y rounded-xl border ${light ? 'divide-line-dark border-line-dark' : 'divide-line border-line bg-sheet'}`}>
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4">
          <summary className={`cursor-pointer list-none font-semibold marker:hidden [&::-webkit-details-marker]:hidden ${light ? 'text-white' : 'text-ink'}`}>
            {item.q}
          </summary>
          <p className={`mt-2 max-w-3xl text-sm leading-relaxed ${light ? 'text-fog' : 'text-mute'}`}>{item.a}</p>
        </details>
      ))}
    </div>
  )
}
