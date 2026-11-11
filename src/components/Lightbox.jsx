import { AnimatePresence } from 'framer-motion';
import ModalShell from './ui/ModalShell';

/** Certificate / achievement viewer. Lazy-loaded by <Achievements> on first open. */
export default function Lightbox({ item, src, onClose }) {
  return (
    <AnimatePresence>
      {item && (
        <ModalShell label={`${item.title}, full size`} onClose={onClose} maxWidth="max-w-4xl">
          <figure>
            <div className="grid max-h-[78vh] place-items-center overflow-auto bg-black/40">
              <img src={src} alt={`${item.title}: ${item.event}, ${item.year}`} className="max-h-[78vh] w-auto max-w-full object-contain" />
            </div>
            <figcaption className="border-t border-line/10 p-5">
              <p className="font-display text-2xl font-bold uppercase tracking-tight">{item.title}</p>
              <p className="mt-1 text-sm text-muted">
                {item.event} · {item.year}
              </p>
            </figcaption>
          </figure>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}
