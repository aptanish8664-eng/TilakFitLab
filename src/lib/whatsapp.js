import { site } from '../data/site';

const clean = (n) => String(n ?? '').replace(/[\s+\-()]/g, '');

/** wa.me link built from src/data/site.js (number + prefilled message). */
export function buildWhatsAppUrl(message = site.whatsapp.message, number = site.whatsapp.number) {
  return `https://wa.me/${clean(number)}?text=${encodeURIComponent(message)}`;
}
