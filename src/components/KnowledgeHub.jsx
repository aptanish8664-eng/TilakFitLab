import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clapperboard } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import VideoCard from './VideoCard';
import { categories, videos } from '../data/videos';

const VideoModal = lazy(() => import('./VideoModal'));
const prefetchModal = () => import('./VideoModal');

const EASE = [0.22, 1, 0.36, 1];

function EmptyState({ library, onReset }) {
  return (
    <motion.div
      key="empty"
      className="col-span-full grid place-items-center rounded-2xl border border-dashed border-line/25 px-6 py-20 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Clapperboard size={40} aria-hidden="true" className="mb-5 text-accent" />
      <p className="font-display text-3xl font-bold uppercase tracking-tight">
        {library ? 'Videos are on the way' : 'Nothing in this category yet'}
      </p>
      <p className="mt-2 max-w-md text-muted">
        {library
          ? 'The knowledge library is being filled with videos on anatomy, training, nutrition and recovery. Check back soon.'
          : 'New videos are added regularly. Browse another category or view everything.'}
      </p>
      {!library && (
        <button type="button" onClick={onReset} className="btn btn-ghost mt-6">
          Show all videos
        </button>
      )}
    </motion.div>
  );
}

export default function KnowledgeHub() {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const [everOpened, setEverOpened] = useState(false);

  const counts = useMemo(() => {
    const map = { all: videos.length };
    categories.forEach((c) => (map[c.id] = videos.filter((v) => v.category === c.id).length));
    return map;
  }, []);

  const visible = useMemo(() => (filter === 'all' ? videos : videos.filter((v) => v.category === filter)), [filter]);

  const open = useCallback((video) => {
    setEverOpened(true);
    setActive(video);
  }, []);
  const close = useCallback(() => setActive(null), []);

  const chips = [{ id: 'all', label: 'All' }, ...categories];

  return (
    <section id="knowledge" aria-labelledby="knowledge-title" className="section-pad relative">
      <div className="container-page">
        <SectionHeading
          id="knowledge-title"
          index="03"
          eyebrow="Knowledge Hub"
          title="Learn the science"
          description="Short videos on anatomy, muscle growth, technique, nutrition and recovery, so you understand why the training works."
        />

        {/* Category filter */}
        <div className="-mx-5 mt-12 sm:mx-0">
          <div role="group" aria-label="Filter videos by category" className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-2 sm:flex-wrap sm:overflow-visible sm:px-0">
            {chips.map((c) => {
              const selected = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(c.id)}
                  className={`relative shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                    selected ? 'border-transparent text-white' : 'border-line/20 text-muted hover:border-accent/50 hover:text-fg'
                  } ${counts[c.id] === 0 && !selected ? 'opacity-60' : ''}`}
                >
                  {selected && (
                    <motion.span
                      layoutId="chip-active"
                      className="absolute inset-0 -z-0 rounded-full bg-accent-strong"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {c.label}
                    <span className={`tabular-nums text-xs ${selected ? 'text-white/80' : 'text-muted/80'}`}>{counts[c.id]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? 'video' : 'videos'}
        </p>

        {/* Grid */}
        <motion.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.length === 0 ? (
              <EmptyState library={videos.length === 0} onReset={() => setFilter('all')} />
            ) : (
              visible.map((v, i) => (
                <motion.li
                  key={v.id}
                  layout
                  className="h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.08 }}
                >
                  <VideoCard video={v} onOpen={open} onIntent={prefetchModal} />
                </motion.li>
              ))
            )}
          </AnimatePresence>
        </motion.ul>
      </div>

      {everOpened && (
        <Suspense fallback={null}>
          <VideoModal video={active} onClose={close} />
        </Suspense>
      )}
    </section>
  );
}
