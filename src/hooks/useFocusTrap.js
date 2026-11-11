import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab inside `ref`, moves focus in when `active` turns on, and restores it when it turns off.
 * Escape handling lives with the caller (it also needs to run close animations).
 */
export function useFocusTrap(ref, active, initialFocus) {
  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const root = ref.current;
    const previous = document.activeElement;

    const focusables = () =>
      Array.from(root.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const target = (initialFocus && root.querySelector(initialFocus)) || focusables()[0] || root;
    target.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener('keydown', onKey);
    return () => {
      root.removeEventListener('keydown', onKey);
      if (previous && typeof previous.focus === 'function') previous.focus({ preventScroll: true });
    };
  }, [active, ref, initialFocus]);
}
