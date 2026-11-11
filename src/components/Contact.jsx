import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ChevronDown, Loader2, Send } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';
import SocialLinks from './ui/SocialLinks';
import { WhatsAppIcon } from './ui/BrandIcons';
import { useContact } from '../context/ContactContext';
import { NOT_SURE, packageOptions, purposeOptions } from '../data/pricing';
import { site } from '../data/site';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { validateContact } from '../lib/validation';

// Field names MUST stay identical to the static Netlify form declarations in
// index.html and public/forms.html: name, email, phone, purpose, package, message, bot-field.
const EMPTY = { name: '', email: '', phone: '', purpose: '', package: NOT_SURE, message: '', 'bot-field': '' };
const FIELD_ORDER = ['name', 'email', 'phone', 'purpose', 'package', 'message'];

function Field({ id, label, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-accent">
            *
          </span>
        )}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            className="mt-2 flex items-start gap-1.5 text-sm text-red-500 dark:text-red-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertTriangle size={14} aria-hidden="true" className="mt-1 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const { selection } = useContact();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [flash, setFlash] = useState(false);
  const formRef = useRef(null);
  const submittingRef = useRef(false); // synchronous lock against double submits

  // A "Get Started" click elsewhere pre-selects the package + matching purpose.
  useEffect(() => {
    if (!selection.nonce) return undefined;
    setValues((v) => ({ ...v, package: selection.packageName ?? v.package, purpose: selection.purpose ?? v.purpose }));
    setErrors((e) => ({ ...e, purpose: undefined }));
    setStatus((s) => (s === 'success' ? 'idle' : s));
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 1600);
    return () => window.clearTimeout(t);
  }, [selection.nonce, selection.packageName, selection.purpose]);

  const set = (field) => (e) => {
    const { value } = e.target;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const ariaFor = (field) => ({
    'aria-invalid': errors[field] ? 'true' : undefined,
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  async function onSubmit(e) {
    e.preventDefault();
    if (submittingRef.current || status === 'submitting') return;

    // Honeypot: a human never sees this field. If it is filled, pretend success and send nothing.
    if (values['bot-field']) {
      setValues(EMPTY);
      setStatus('success');
      return;
    }

    const found = validateContact(values);
    setErrors(found);
    const firstBad = FIELD_ORDER.find((f) => found[f]);
    if (firstBad) {
      formRef.current?.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus('submitting');
    try {
      // Netlify Forms: urlencoded POST to "/" with form-name. Only works on the DEPLOYED Netlify site.
      // In `npm run dev` / `npm run preview` there is no Netlify to receive it, so this request
      // fails and the error state below is shown. That is expected, not a bug, and is NOT faked.
      const body = new URLSearchParams({
        'form-name': site.formName,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        purpose: values.purpose,
        package: values.package,
        message: values.message.trim(),
        'bot-field': values['bot-field'],
      }).toString();

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(`Form submission failed: ${res.status}`);

      setValues(EMPTY);
      setErrors({});
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      submittingRef.current = false;
    }
  }

  const submitting = status === 'submitting';

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad relative">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left: copy + direct channels */}
          <div className="lg:col-span-5">
            <SectionHeading
              id="contact-title"
              index="05"
              eyebrow="Contact"
              title="Let's build your plan"
              description="Tell me about your goals and where you are starting from. Prefer a quick chat? Message me on WhatsApp."
            />
            <Reveal delay={0.2} className="mt-10 space-y-8">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full sm:w-auto"
              >
                <WhatsAppIcon size={20} /> Chat on WhatsApp
              </a>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Follow along</p>
                <SocialLinks />
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal direction="left" distance={40} className="lg:col-span-7">
            <div className="rounded-3xl border border-line/15 bg-surface p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.5)] sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    role="status"
                    className="py-10 text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                    >
                      <CheckCircle2 size={34} aria-hidden="true" />
                    </motion.span>
                    <h3 className="font-display text-4xl font-bold uppercase tracking-tight">Message sent</h3>
                    <p className="mx-auto mt-3 max-w-sm text-muted">
                      Thank you for reaching out. Your details have been received and you will hear back soon.
                    </p>
                    <button type="button" className="btn btn-ghost mt-8" onClick={() => setStatus('idle')}>
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    name={site.formName}
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    noValidate
                    onSubmit={onSubmit}
                    aria-busy={submitting}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <input type="hidden" name="form-name" value={site.formName} />
                    {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
                    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                      <label>
                        Leave this field empty
                        <input
                          type="text"
                          name="bot-field"
                          tabIndex={-1}
                          autoComplete="off"
                          value={values['bot-field']}
                          onChange={set('bot-field')}
                        />
                      </label>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field id="name" label="Full name" error={errors.name} required>
                        <input id="name" name="name" type="text" autoComplete="name" className="field" value={values.name} onChange={set('name')} aria-required="true" {...ariaFor('name')} />
                      </Field>
                      <Field id="phone" label="Phone" error={errors.phone} required>
                        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" className="field" value={values.phone} onChange={set('phone')} aria-required="true" {...ariaFor('phone')} />
                      </Field>
                    </div>

                    <Field id="email" label="Email" error={errors.email} required>
                      <input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" className="field" value={values.email} onChange={set('email')} aria-required="true" {...ariaFor('email')} />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field id="purpose" label="Purpose of enquiry" error={errors.purpose} required>
                        <div className="relative">
                          <select id="purpose" name="purpose" className="field appearance-none pr-11" value={values.purpose} onChange={set('purpose')} aria-required="true" {...ariaFor('purpose')}>
                            <option value="">Select a purpose</option>
                            {purposeOptions.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
                        </div>
                      </Field>
                      <Field id="package" label="Selected training package" error={errors.package}>
                        <div className="relative">
                          <select
                            id="package"
                            name="package"
                            className={`field appearance-none pr-11 ${flash ? '!border-accent ring-2 ring-accent/40' : ''}`}
                            value={values.package}
                            onChange={set('package')}
                            {...ariaFor('package')}
                          >
                            {packageOptions.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
                        </div>
                      </Field>
                    </div>

                    <Field id="message" label="Message" error={errors.message} required>
                      <textarea id="message" name="message" rows={5} maxLength={2000} placeholder="Your goals, experience level, schedule..." className="field resize-y" value={values.message} onChange={set('message')} aria-required="true" {...ariaFor('message')} />
                    </Field>

                    <AnimatePresence initial={false}>
                      {status === 'error' && (
                        <motion.div
                          role="alert"
                          className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <p className="font-semibold text-red-600 dark:text-red-400">Your message could not be sent.</p>
                          <p className="mt-1 text-fg/80">
                            Please try again in a moment, or{' '}
                            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline underline-offset-4">
                              message me on WhatsApp
                            </a>{' '}
                            instead.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={submitting} className="btn btn-primary w-full !py-4 text-base sm:w-auto sm:min-w-[14rem]">
                      {submitting ? (
                        <>
                          <Loader2 size={18} aria-hidden="true" className="animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          Send message <Send size={16} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
