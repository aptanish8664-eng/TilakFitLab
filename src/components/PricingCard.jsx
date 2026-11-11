import { memo } from 'react';
import { ArrowRight, Check, Star } from 'lucide-react';
import { StaggerItem } from './ui/Stagger';
import { formatPrice } from '../lib/utils';

function PricingCard({ pkg, onChoose }) {
  const price = formatPrice(pkg.price);
  const featured = pkg.popular;

  return (
    <StaggerItem className="h-full">
      <div
        className={`group relative h-full overflow-hidden rounded-3xl p-px transition-[transform,box-shadow] duration-500 hover:-translate-y-2 ${
          featured
            ? 'bg-accent/30 shadow-[0_30px_80px_-40px_rgb(var(--c-accent)/0.8)]'
            : 'bg-line/15 hover:bg-accent/40 hover:shadow-[0_30px_70px_-40px_rgb(var(--c-accent)/0.6)]'
        }`}
      >
        {/* Animated border: an oversized conic gradient rotates behind the 1px edge (transform only). */}
        {featured && (
          <span
            aria-hidden="true"
            className="absolute inset-[-100%] motion-safe:animate-spin-slow"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0 55%, rgb(var(--c-accent)) 80%, transparent 100%)',
            }}
          />
        )}

        <article className="relative flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-surface p-7 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <span
              aria-hidden="true"
              className="font-display text-7xl font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(var(--c-accent)/0.55)]"
            >
              {pkg.code}
            </span>
            {featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-strong px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white">
                <Star size={12} className="fill-current" aria-hidden="true" /> Most Popular
              </span>
            )}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Package {pkg.code}</p>
          <h3 className="mt-1 font-display text-3xl font-bold uppercase leading-[1.02] tracking-tight">{pkg.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{pkg.summary}</p>

          <div className="mt-7 border-y border-line/10 py-5">
            <p className={`font-display text-4xl font-bold tracking-tight ${price.placeholder ? 'ph !no-underline text-muted' : ''}`}>
              {price.text}
            </p>
            {pkg.priceNote && <p className="mt-1 text-sm text-muted">{pkg.priceNote}</p>}
          </div>

          <ul className="mt-6 flex-1 space-y-3.5">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm leading-snug text-fg/85">
                <Check size={18} aria-hidden="true" className="mt-px shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => onChoose(pkg.id)}
            className={`btn mt-9 w-full ${featured ? 'btn-primary' : 'btn-ghost group-hover:border-accent/60'}`}
            aria-label={`Get started with ${pkg.name}`}
          >
            Get Started
            <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </article>
      </div>
    </StaggerItem>
  );
}

export default memo(PricingCard);
