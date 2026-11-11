import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SkipForward } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { introVideoUrl, introPosterUrl, logoUrl } from '../lib/assets';
import { site } from '../data/site';

// PLACEHOLDER NOTE: src/assets/videos/intro.mp4 is the supplied logo video, trimmed to the first
// ~4.8 s (the logo has fully resolved by ~2.5 s; the rest of the original is just a hold).
// Overwrite that file to change the intro. If it is missing, a pure Framer Motion logo animation
// runs instead, and the intro-poster image / logo is used as the static fallback.

const PLAYBACK_RATE = 1.5; // 4.8 s of footage -> ~3.2 s on screen
const HARD_CAP_MS = 4000; // never hold the visitor longer than this
const START_TIMEOUT_MS = 1500; // autoplay blocked / stalled -> static logo
const STATIC_HOLD_MS = 1800;
const REDUCED_HOLD_MS = 1100;

// Background sampled from the video itself so there is no visible box edge.
const VIDEO_BG = 'radial-gradient(ellipse at 50% 50%, #f1f1f1 0%, #d7d7d7 45%, #b4b5b5 100%)';

/**
 * Plays once per page load. Lifecycle is owned by <App> (React state, not storage):
 *   onExitStart -> hero entrance animations begin as the overlay leaves
 *   onDone      -> overlay unmounted, scroll lock released
 */
export default function IntroAnimation({ onExitStart, onDone }) {
  const reduce = useReducedMotion();
  const hasVideo = Boolean(introVideoUrl) && !reduce;

  const [mode, setMode] = useState(hasVideo ? 'video' : 'static'); // 'video' | 'static'
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef(null);
  const skipRef = useRef(null);
  const startedRef = useRef(false);
  const leavingRef = useRef(false);

  useScrollLock(true);

  const finish = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    onExitStart();
  }, [onExitStart]);

  // Keyboard: skip button is focused immediately; Escape also skips.
  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  // Timers: hard cap, autoplay watchdog, static / reduced-motion hold.
  useEffect(() => {
    const timers = [];
    if (mode === 'video') {
      timers.push(window.setTimeout(finish, HARD_CAP_MS));
      timers.push(
        window.setTimeout(() => {
          if (!startedRef.current) setMode('static');
        }, START_TIMEOUT_MS),
      );
    } else {
      timers.push(window.setTimeout(finish, reduce ? REDUCED_HOLD_MS : STATIC_HOLD_MS));
    }
    return () => timers.forEach(window.clearTimeout);
  }, [mode, reduce, finish]);

  const onVideoRef = useCallback((el) => {
    videoRef.current = el;
    if (el) {
      el.muted = true; // React's `muted` prop is unreliable for autoplay policies
      el.defaultPlaybackRate = PLAYBACK_RATE;
      el.playbackRate = PLAYBACK_RATE;
    }
  }, []);

  const tryPlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = PLAYBACK_RATE;
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => setMode('static'));
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${site.brand} intro`}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: VIDEO_BG }}
      initial={{ clipPath: 'circle(150% at 50% 50%)' }}
      animate={
        leaving
          ? reduce
            ? { opacity: 0 } // reduced motion: plain fade, no wipe
            : { clipPath: 'circle(0% at 50% 50%)' }
          : { clipPath: 'circle(150% at 50% 50%)', opacity: 1 }
      }
      transition={{ duration: leaving ? (reduce ? 0.4 : 0.95) : 0, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (leaving) onDone();
      }}
    >
      {/* Media stack: poster underneath, video on top, both centred in the same grid cell.
          (.intro-media in index.css: cover on landscape, scaled + edge-feathered on portrait.) */}
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        {/* Layer 1: always-present poster, so there is never a blank screen */}
        {introPosterUrl && (
          <img
            src={introPosterUrl}
            alt=""
            aria-hidden="true"
            className="intro-media [grid-area:1/1]"
            style={{ opacity: mode === 'video' ? 0 : 1, transition: 'opacity .4s ease' }}
          />
        )}

        {/* Layer 2: the video */}
        {mode === 'video' && introVideoUrl && (
          <video
            ref={onVideoRef}
            src={introVideoUrl}
            poster={introPosterUrl ?? undefined}
            className="intro-media [grid-area:1/1]"
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onLoadedMetadata={tryPlay}
            onCanPlay={tryPlay}
            onPlaying={(e) => {
              startedRef.current = true;
              e.currentTarget.playbackRate = PLAYBACK_RATE;
            }}
            onRateChange={(e) => {
              // some browsers reset the rate while loading; keep it pinned
              if (e.currentTarget.playbackRate !== PLAYBACK_RATE) e.currentTarget.playbackRate = PLAYBACK_RATE;
            }}
            onEnded={finish}
            onError={() => setMode('static')}
          />
        )}
      </div>

      {/* Layer 3: no video and no poster at all -> animated logo / wordmark */}
      {!introPosterUrl && mode === 'static' && (
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={site.brand} className="h-16 w-auto sm:h-24" />
            ) : (
              <span className="font-display text-6xl font-bold uppercase tracking-tight text-navy sm:text-8xl">
                Tilak<span className="text-brand">Fit</span>Lab
              </span>
            )}
          </motion.div>
        </div>
      )}

      <button
        ref={skipRef}
        type="button"
        onClick={finish}
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-[#0a1230]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a1230] backdrop-blur transition-colors hover:bg-white sm:right-8 sm:top-8"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
      >
        Skip intro <SkipForward size={14} aria-hidden="true" />
      </button>
    </motion.div>
  );
}
