import { useReducedMotion } from 'framer-motion';

/** Boolean wrapper (Framer returns null before the first check). */
export function usePrefersReducedMotion() {
  return Boolean(useReducedMotion());
}
