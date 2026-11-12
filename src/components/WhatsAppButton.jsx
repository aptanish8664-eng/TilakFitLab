import { AnimatePresence, motion } from 'framer-motion';
import { WhatsAppIcon } from './ui/BrandIcons';
import { buildWhatsAppUrl } from '../lib/whatsapp';

/**
 * Floating WhatsApp shortcut. The number comes from src/data/site.js.
 * The pulse ring is CSS-only and is switched off by the global reduced-motion rule.
 */
export default function WhatsAppButton({ visible = true, hidden = false }) {
  return (
    <AnimatePresence>
      {visible && !hidden && (
        <motion.a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-[#04210f] shadow-[0_12px_30px_-8px_rgba(37,211,102,0.65)] transition-transform hover:scale-105 focus-visible:outline-offset-4"
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.4 }}
        >
          <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-whatsapp/60 motion-safe:animate-pulse-ring" />
          <WhatsAppIcon size={28} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
