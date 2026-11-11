// Contact form validation. Pure functions, no dependencies.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Accepts Indian mobiles in the usual shapes: 9876543210, 98765 43210, 98765-43210,
 * 09876543210, 919876543210, +91 98765 43210. Mobiles start with 6-9.
 * Also accepts international numbers written with a leading + (8-15 digits), because online
 * coaching clients can be abroad.
 * @returns {string} error message, or '' when valid
 */
export function validatePhone(raw) {
  const v = String(raw ?? '').trim();
  if (!v) return 'Enter your phone number.';
  if (!/^\+?[\d\s\-()]+$/.test(v)) return 'Use digits only; spaces and dashes are fine.';
  const digits = v.replace(/\D/g, '');
  const hasPlus = v.startsWith('+');
  const indianMobile = /^(?:91|0)?[6-9]\d{9}$/.test(digits);

  if (hasPlus) {
    if (digits.startsWith('91')) {
      return /^91[6-9]\d{9}$/.test(digits) ? '' : 'Enter a valid Indian mobile number, e.g. +91 98765 43210.';
    }
    return digits.length >= 8 && digits.length <= 15 ? '' : 'Enter a valid international number, e.g. +44 7911 123456.';
  }
  return indianMobile ? '' : 'Enter a valid 10-digit mobile number (+91 optional).';
}

export function validateEmail(raw) {
  const v = String(raw ?? '').trim();
  if (!v) return 'Enter your email address.';
  return EMAIL_RE.test(v) ? '' : 'Enter a valid email address, e.g. name@example.com.';
}

/** @returns {Record<string,string>} map of field -> message (empty object when valid) */
export function validateContact(values) {
  const errors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Enter your name.';
  else if (name.length < 2) errors.name = 'Your name looks too short.';

  const email = validateEmail(values.email);
  if (email) errors.email = email;

  const phone = validatePhone(values.phone);
  if (phone) errors.phone = phone;

  if (!values.purpose) errors.purpose = 'Choose what you are enquiring about.';

  const message = values.message.trim();
  if (!message) errors.message = 'Tell me a little about your goals.';
  else if (message.length < 10) errors.message = 'Please write at least a short sentence (10+ characters).';

  return errors;
}
