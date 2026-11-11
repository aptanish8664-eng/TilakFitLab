import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Logo from './ui/Logo';
import ThemeToggle from './ThemeToggle';
import { WhatsAppIcon } from './ui/BrandIcons';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrollLock } from '../hooks/useScrollLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { scrollToId } from '../lib/utils';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { site } from '../data/site';

const NAV_IDS = site.nav.map((n) => n.id);
const EASE = [0.22, 1, 0.36, 1];

function MenuIcon({ open }) {
  const bar = 'absolute left-0 h-0.5 w-6 rounded bg-current';
  return (
    <span className="relative block h-6 w-6" aria-hidden="true">
      <motion.span className={`${bar} top-[5px]`} animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }} />
      <motion.span className={`${bar} top-[11px]`} animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.15 }} />
      <motion.span className={`${bar} top-[17px]`} animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }} />
    </span>
  );
}

export default function Navbar({ revealed = true }) {
  const active = useActiveSection(NAV_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useScrollLock(open);
  useFocusTrap(panelRef, open, 'a');

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Escape closes the mobile menu; crossing into desktop width closes it too.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 1280px)');
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const go = useCallback((e, id) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      // wait for the scroll lock to release before scrolling
      window.setTimeout(() => scrollToId(id), 120);
    } else {
      scrollToId(id);
    }
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid ? 'border-line/10 bg-bg/80 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      >
        <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
          <a href="#home" onClick={(e) => go(e, 'home')} aria-label={`${site.brand}, back to top`} className="shrink-0">
            <Logo imgClassName="h-7 sm:h-8" />
          </a>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`relative block px-3.5 py-2 text-sm font-medium transition-colors ${
                      active === item.id ? 'text-fg' : 'text-muted hover:text-fg'
                    }`}
                  >
                    {item.label}
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded bg-accent"
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              onClick={(e) => go(e, 'contact')}
              className="btn btn-primary hidden !py-2.5 xl:inline-flex"
            >
              Book a Consultation
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line/20 text-fg transition-colors hover:border-accent/60 xl:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[45] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-[#02040a]/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.div
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-y-0 right-0 flex w-[min(88vw,26rem)] flex-col overflow-y-auto border-l border-line/10 bg-surface pb-8 pt-[calc(var(--header-h)+1rem)] shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <ul className="flex flex-1 flex-col px-7">
                {site.nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: EASE }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => go(e, item.id)}
                      aria-current={active === item.id ? 'true' : undefined}
                      className={`group flex items-baseline gap-4 border-b border-line/10 py-4 font-display text-4xl font-bold uppercase tracking-tight transition-colors ${
                        active === item.id ? 'text-accent' : 'text-fg hover:text-accent'
                      }`}
                    >
                      <span className="w-6 font-sans text-xs font-medium tabular-nums text-muted">0{i + 1}</span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="space-y-3 px-7 pt-8">
                <a href="#contact" onClick={(e) => go(e, 'contact')} className="btn btn-primary w-full">
                  Book a Consultation <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost w-full"
                >
                  <WhatsAppIcon size={16} /> Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
