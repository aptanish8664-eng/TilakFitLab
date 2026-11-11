import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/**
 * Shared dialog chrome for the video modal and the certificate lightbox.
 * Render it INSIDE <AnimatePresence> so the exit animation plays.
 * Handles: Escape, backdrop click, scroll lock, focus trap + restore, aria-modal.
 */
export default function ModalShell({ label, onClose, children, maxWidth = 'max-w-5xl' }) {
  const dialogRef = useRef(null);
  useScrollLock(true);
  useFocusTrap(dialogRef, true, '[data-close]');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute inset-0 bg-[#02040a]/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
        data-testid="modal-backdrop"
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`relative max-h-[94svh] w-full ${maxWidth} overflow-y-auto overscroll-contain rounded-2xl border border-line/15 bg-surface shadow-2xl shadow-black/50 outline-none`}
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          data-close
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/80"
        >
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
