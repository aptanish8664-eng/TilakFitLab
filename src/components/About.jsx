import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BadgeCheck, Dumbbell } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';
import Counter from './ui/Counter';
import Ph from './ui/Ph';
import { Stagger, StaggerItem } from './ui/Stagger';
import { trainerPhotoUrl } from '../lib/assets';
import { trainer } from '../data/trainer';

const EASE = [0.22, 1, 0.36, 1];

// Only statistics with a real numeric value are ever rendered.
const realStats = (trainer.stats ?? []).filter((s) => typeof s.value === 'number' && Number.isFinite(s.value));

function Label({ children }) {
  return <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{children}</h3>;
}

export default function About() {
  const photoRef = useRef(null);
  // Observe the unclipped figure; the clip-path'd child would report zero visible area.
  const photoIn = useInView(photoRef, { once: true, amount: 0.25 });
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad relative">
      <div className="container-page">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Photograph: mask reveal from the left */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <figure ref={photoRef}>
              <div className="relative">
              <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl border border-accent/40" />
              <motion.div
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-soft"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: photoIn ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                transition={{ duration: 1.3, ease: EASE }}
              >
                {trainerPhotoUrl ? (
                  <div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]">
                  <motion.img
                    src={trainerPhotoUrl}
                    alt={trainer.photoAlt}
                    width="1200"
                    height="1500"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: photoIn ? 1 : 1.2 }}
                    transition={{ duration: 1.6, ease: EASE }}
                  />
                  </div>
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted">
                    <Dumbbell size={56} aria-hidden="true" />
                  </div>
                )}
                {trainer.photoIsPlaceholder && (
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    Placeholder photo
                  </span>
                )}
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
              </div>
              <figcaption className="mt-6 flex items-center gap-3 text-sm text-muted">
                <span aria-hidden="true" className="h-px w-8 bg-accent" />
                <Ph>{trainer.fullName}</Ph>
              </figcaption>
            </figure>
          </div>

          {/* Copy: enters from the opposite side */}
          <div className="lg:col-span-7">
            <SectionHeading id="about-title" index="01" eyebrow="About" title="Meet your coach" />

            <Reveal direction="left" distance={48} delay={0.1} className="mt-10">
              <p className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                <Ph>{trainer.fullName}</Ph>
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-muted">
                <Ph>{trainer.designation}</Ph>
              </p>
            </Reveal>

            <Stagger className="mt-10 space-y-10" gap={0.12}>
              <StaggerItem direction="left">
                <Label>Professional background</Label>
                <div className="space-y-4 text-base leading-relaxed text-fg/85 sm:text-lg">
                  {trainer.background.map((p, i) => (
                    <p key={i}>
                      <Ph>{p}</Ph>
                    </p>
                  ))}
                </div>
              </StaggerItem>

              <StaggerItem direction="left">
                <Label>Fitness journey</Label>
                <div className="space-y-4 text-base leading-relaxed text-fg/85 sm:text-lg">
                  {trainer.journey.map((p, i) => (
                    <p key={i}>
                      <Ph>{p}</Ph>
                    </p>
                  ))}
                </div>
              </StaggerItem>

              <StaggerItem direction="left">
                <blockquote className="border-l-2 border-accent pl-6">
                  <Label>Training philosophy</Label>
                  <p className="font-display text-2xl font-semibold uppercase leading-snug tracking-tight sm:text-3xl">
                    <Ph>{trainer.philosophy}</Ph>
                  </p>
                </blockquote>
              </StaggerItem>

              <div className="grid gap-10 sm:grid-cols-2">
                <StaggerItem direction="left">
                  <Label>Experience</Label>
                  <p className="leading-relaxed text-fg/85">
                    <Ph>{trainer.experience}</Ph>
                  </p>
                </StaggerItem>
                <StaggerItem direction="left">
                  <Label>Approach to bodybuilding and fitness</Label>
                  <p className="leading-relaxed text-fg/85">
                    <Ph>{trainer.approach}</Ph>
                  </p>
                </StaggerItem>
              </div>

              <div className="grid gap-10 sm:grid-cols-2">
                <StaggerItem direction="left">
                  <Label>Certifications</Label>
                  <ul className="space-y-3">
                    {trainer.certifications.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 text-fg/85">
                        <BadgeCheck size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                        <Ph>{c}</Ph>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
                <StaggerItem direction="left">
                  <Label>Specialisations</Label>
                  <ul className="flex flex-wrap gap-2">
                    {trainer.specialisations.map((s, i) => (
                      <li key={i} className="rounded-full border border-line/20 bg-surface px-4 py-2 text-sm">
                        <Ph>{s}</Ph>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              </div>
            </Stagger>
          </div>
        </div>

        {/* Rendered ONLY when trainer.stats contains real values */}
        {realStats.length > 0 && (
          <Stagger className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/15 bg-line/15 md:grid-cols-4">
            {realStats.map((s) => (
              <StaggerItem key={s.label} className="bg-surface p-8 text-center">
                <div className="font-display text-5xl font-bold text-accent sm:text-6xl">
                  <Counter value={s.value} suffix={s.suffix ?? ''} prefix={s.prefix ?? ''} />
                </div>
                <div className="mt-2 text-sm uppercase tracking-[0.14em] text-muted">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
