import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ModalShell from './ui/ModalShell';
import { categoryThumbUrl, resolveMedia } from '../lib/assets';
import { toPlayable } from '../lib/video';
import { categories } from '../data/videos';

const labelFor = (id) => categories.find((c) => c.id === id)?.label ?? id;

function Player({ video, mediaRef }) {
  const [failed, setFailed] = useState(false);

  // local -> file in src/assets/videos (or a /public path); external -> YouTube/Vimeo embed or direct URL
  const raw = video.type === 'external' ? video.src : resolveMedia(video.src, 'videos');
  const playable = raw ? (video.type === 'external' ? toPlayable(raw) : { kind: 'file', src: raw }) : null;

  if (!playable || failed) {
    return (
      <div className="grid aspect-video place-items-center bg-black px-6 text-center text-white/80">
        <div>
          <AlertCircle className="mx-auto mb-3 text-white/60" aria-hidden="true" />
          <p>This video could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black">
      <div className="mx-auto aspect-video w-full max-w-[calc(70svh*16/9)]">
        {playable.kind === 'iframe' ? (
          <iframe
            ref={mediaRef}
            src={playable.src}
            title={video.title}
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <video
            ref={mediaRef}
            src={playable.src}
            poster={resolveMedia(video.thumbnail, 'images') || categoryThumbUrl(video.category) || undefined}
            className="h-full w-full"
            controls
            autoPlay
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Lazy-loaded by <KnowledgeHub> on first use. Stays mounted afterwards so the exit animation can
 * play; the <video>/<iframe> itself is unmounted with the dialog, and is paused/blanked first.
 */
export default function VideoModal({ video, onClose }) {
  const mediaRef = useRef(null);

  const handleClose = useCallback(() => {
    const el = mediaRef.current;
    if (el) {
      if (el.tagName === 'VIDEO') el.pause();
      else if (el.tagName === 'IFRAME') el.src = 'about:blank'; // silence embeds immediately
    }
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {video && (
        <ModalShell key={video.id} label={video.title} onClose={handleClose}>
          <Player video={video} mediaRef={mediaRef} />
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{labelFor(video.category)}</p>
            <h3 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">{video.title}</h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted">{video.description}</p>
          </div>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}
