import { memo, useState } from 'react';
import { Clock, Play, Film } from 'lucide-react';
import { categoryThumbUrl, resolveMedia } from '../lib/assets';
import { categories } from '../data/videos';

const labelFor = (id) => categories.find((c) => c.id === id)?.label ?? id;

/**
 * Thumbnail fallback chain: video.thumbnail -> generated category thumbnail -> CSS gradient.
 * Videos are NEVER preloaded here; only the poster image is (lazily).
 */
function VideoCard({ video, onOpen, onIntent }) {
  const initial = resolveMedia(video.thumbnail, 'images') || categoryThumbUrl(video.category);
  const [thumb, setThumb] = useState(initial);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/15 bg-surface transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[0_24px_60px_-30px_rgb(var(--c-accent)/0.55)]">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brand-navy to-[#050816]">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            aria-hidden="true"
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            onError={() => setThumb(null)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="grid h-full place-items-center text-white/30">
            <Film size={44} aria-hidden="true" />
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        {/* Animated play button */}
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white/90 text-[#0a1230] shadow-xl transition-transform duration-300 group-hover:scale-110">
            <span className="absolute inset-0 rounded-full bg-white/60 opacity-0 group-hover:opacity-100 group-hover:motion-safe:animate-pulse-ring" />
            <Play size={24} className="ml-1 fill-current" />
          </span>
        </span>

        {video.duration && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-xs font-medium tabular-nums text-white backdrop-blur">
            <Clock size={12} aria-hidden="true" />
            {video.duration}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">{labelFor(video.category)}</p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight tracking-tight">{video.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{video.description}</p>
      </div>

      {/* Stretched button: the whole card is the click target */}
      <button
        type="button"
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`Play video: ${video.title} (${labelFor(video.category)})`}
        onClick={(e) => onOpen(video, e.currentTarget)}
        onPointerEnter={onIntent}
        onFocus={onIntent}
      />
    </article>
  );
}

export default memo(VideoCard);
