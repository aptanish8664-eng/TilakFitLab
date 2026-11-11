import { useEffect } from 'react';

// Ref-counted so the intro, mobile menu and modals can overlap without unlocking each other.
// `scrollbar-gutter: stable` (index.css) stops the page shifting when overflow flips to hidden.
let locks = 0;

function apply() {
  document.documentElement.style.overflow = locks > 0 ? 'hidden' : '';
}

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    locks += 1;
    apply();
    return () => {
      locks = Math.max(0, locks - 1);
      apply();
    };
  }, [active]);
}
