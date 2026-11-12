import { ArrowUp } from 'lucide-react';
import Logo from './ui/Logo';
import SocialLinks from './ui/SocialLinks';
import { Stagger, StaggerItem } from './ui/Stagger';
import { WhatsAppIcon } from './ui/BrandIcons';
import { useContact } from '../context/ContactContext';
import { packages } from '../data/pricing';
import { site } from '../data/site';
import { trainer } from '../data/trainer';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { scrollToId } from '../lib/utils';

const linkCls = 'text-sm text-muted transition-colors hover:text-accent';
const headCls = 'mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-fg';

export default function Footer() {
  const { choosePackage } = useContact();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line/10 bg-bg pt-20">
      <Stagger className="container-page grid gap-12 md:grid-cols-12" gap={0.1}>
        <StaggerItem className="md:col-span-5">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToId('home'); }} aria-label={`${site.brand}, back to top`} className="inline-block">
            <Logo imgClassName="h-9" />
          </a>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{site.footerBlurb}</p>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent"
          >
            <WhatsAppIcon size={18} /> Message on WhatsApp
          </a>
          <SocialLinks className="mt-6" />
        </StaggerItem>

        <StaggerItem className="md:col-span-3 md:col-start-7">
          <h2 className={headCls}>Navigate</h2>
          <ul className="space-y-3">
            {site.nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); scrollToId(n.id); }} className={linkCls}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </StaggerItem>

        <StaggerItem className="md:col-span-3">
          <h2 className={headCls}>Training programs</h2>
          <ul className="space-y-3">
            {packages.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => choosePackage(p.id)} className={`${linkCls} text-left`}>
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </StaggerItem>
      </Stagger>

      {/* Oversized outlined wordmark: decorative */}
      <div aria-hidden="true" className="pointer-events-none mt-16 select-none overflow-hidden text-center">
        <p className="font-display text-[clamp(4rem,17.5vw,17rem)] font-bold uppercase leading-[0.8] tracking-tight text-transparent [-webkit-text-stroke:1px_rgb(var(--c-line)/0.14)]">
          {site.brand}
        </p>
      </div>

      <div className="border-t border-line/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 pb-24 text-xs text-muted sm:flex-row sm:pb-6">
          <p>
            &copy; {year} {site.brand} &middot; {trainer.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => scrollToId('home')}
            className="inline-flex items-center gap-2 font-medium uppercase tracking-[0.16em] transition-colors hover:text-accent"
          >
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
