/** Anything wrapped in [square brackets] inside /src/data is a placeholder the owner must replace. */
export const isPlaceholder = (value) => typeof value === 'string' && /^\s*\[.*\]\s*$/.test(value);

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

/** null/undefined -> editable placeholder, number -> "₹4,999" */
export function formatPrice(price) {
  if (typeof price === 'number' && Number.isFinite(price)) return { text: inr.format(price), placeholder: false };
  return { text: '₹ [Add price]', placeholder: true };
}

/** Smooth in-page scroll that honours reduced motion and keeps the hash in sync. */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  try {
    history.replaceState(null, '', `#${id}`);
  } catch {
    /* sandboxed frames etc. */
  }
}
