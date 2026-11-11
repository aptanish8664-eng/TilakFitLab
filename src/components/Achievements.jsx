import { lazy, memo, Suspense, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Expand } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import Ph from './ui/Ph';
import { Stagger, StaggerItem } from './ui/Stagger';
import { achievementFallbackUrl, resolveMedia } from '../lib/assets';
import { achievements } from '../data/achievements';

const Lightbox = lazy(() => import('./Lightbox'));
const prefetchLightbox = () => import('./Lightbox');

const AchievementCard = memo(function AchievementCard({ item, onOpen }) {
  const real = resolveMedia(item.image, 'images');
  const src = real || achievementFallbackUrl;
  const clickable = Boolean(real);

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        {src ? (
          <img
            src={src}
            alt={clickable ? `${item.title} certificate` : ''}
            aria-hidden={clickable ? undefined : 'true'}
            width="1200"
            height="900"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted">
            <Award size={48} aria-hidden="true" />
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
        <span className="absolute left-4 top-4 rounded-full bg-accent-strong px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white">
          {item.type}
        </span>
        {item.placeholder && (
          <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/55 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
            Placeholder
          </span>
        )}
        {clickable && (
          <span
            aria-hidden="true"
            className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
          >
            <Expand size={18} />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          <Ph>{item.year}</Ph>
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight tracking-tight">{item.title}</h3>
        <p className="mt-1 text-sm font-medium text-muted">
          <Ph>{item.event}</Ph>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-fg/80">
          <Ph>{item.description}</Ph>
        </p>
      </div>
    </>
  );

  const cls =
    'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/15 bg-surface transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[0_24px_60px_-30px_rgb(var(--c-accent)/0.55)]';

  return (
    <StaggerItem className="h-full">
      <article className={cls}>
        {body}
        {clickable && (
          // Stretched button: whole card is one click target without nesting headings inside a <button>.
          <button
            type="button"
            className="absolute inset-0 z-10 rounded-2xl"
            onClick={() => onOpen(item, src)}
            onPointerEnter={prefetchLightbox}
            onFocus={prefetchLightbox}
            aria-label={`View ${item.title} full size`}
          />
        )}
      </article>
    </StaggerItem>
  );
});

export default function Achievements() {
  const [active, setActive] = useState(null); // { item, src }
  const [everOpened, setEverOpened] = useState(false);

  const open = useCallback((item, src) => {
    setEverOpened(true);
    setActive({ item, src });
  }, []);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="achievements" aria-labelledby="achievements-title" className="section-pad relative bg-soft">
      <div className="container-page">
        <SectionHeading
          id="achievements-title"
          index="02"
          eyebrow="Achievements"
          title="Titles, awards & credentials"
          description="Competitions, certifications and milestones that back the coaching."
        />

        {achievements.length === 0 ? (
          <motion.div
            className="mt-14 grid place-items-center rounded-2xl border border-dashed border-line/25 p-14 text-center text-muted"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Award size={36} aria-hidden="true" className="mb-4 text-accent" />
            <p>Achievements and certifications will appear here.</p>
          </motion.div>
        ) : (
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.1}>
            {achievements.map((a) => (
              <AchievementCard key={a.id} item={a} onOpen={open} />
            ))}
          </Stagger>
        )}
      </div>

      {everOpened && (
        <Suspense fallback={null}>
          <Lightbox item={active?.item ?? null} src={active?.src} onClose={close} />
        </Suspense>
      )}
    </section>
  );
}
