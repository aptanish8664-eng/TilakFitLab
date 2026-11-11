import { site } from '../data/site';

const clean = (n) => String(n ?? '').replace(/[\s+\-()]/g, '');

/**
 * wa.me link. Stays well-formed even while the number is still the placeholder
 * (so buttons render), but it will only open a real chat once site.whatsapp.number
 * in src/data/site.js is replaced with country code + number, digits only.
 */
export function buildWhatsAppUrl(message = site.whatsapp.message, number = site.whatsapp.number) {
  return `https://wa.me/${clean(number)}?text=${encodeURIComponent(message)}`;
}

/** True once the owner has put a real number in src/data/site.js. */
export const whatsappConfigured = /^\d{10,15}$/.test(clean(site.whatsapp.number));
