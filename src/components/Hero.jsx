import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MagneticButton from './ui/MagneticButton';
import Ph from './ui/Ph';
import { heroVideoUrl, heroPosterUrl } from '../lib/assets';
import { scrollToId } from '../lib/utils';
import { trainer } from '../data/trainer';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// PLACEHOLDER NOTE: src/assets/videos/hero.mp4 and src/assets/images/hero-poster.jpg are generated
// stand-ins (slow brand-blue gradient with film grain). Overwrite them, same file names, with the
// real fitness footage and a still frame from it.

const EASE = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } };
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } };
const word = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease: EASE } } };

const isDataSaver = () => {
  const c = typeof navigator !== 'undefined' ? navigator.connection : null;
  return Boolean(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
};

function HeroMedia({ playVideo, onFail }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Pause the loop while the hero is off screen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [playVideo]);

  return (
    <>
      {/* Always-on backdrop: if nothing else loads, the hero still looks intentional. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,#1d4fc0_0%,#0a1440_45%,#04060f_100%)]"
      />
      {heroPosterUrl && (
        <img
          src={heroPosterUrl}
          alt=""
          aria-hidden="true"
          width="1280"
          height="720"
          decoding="async"
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {playVideo && (
        <video
          ref={videoRef}
          src={heroVideoUrl}
          poster={heroPosterUrl ?? undefined}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          onLoadedData={() => setReady(true)}
          onError={onFail}
        />
      )}
    </>
  );
}

export default function Hero({ revealed }) {
  const sectionRef = useRef(null);
  const reduce = usePrefersReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const [failed, setFailed] = useState(false);
  const [saver] = useState(isDataSaver);

  // Heavy bits (video, parallax) only where they make sense.
  // `revealed`: don't start fetching the loop until the intro has handed over (keeps the intro's bandwidth to itself).
  const playVideo = revealed && Boolean(heroVideoUrl) && wide && !reduce && !saver && !failed;
  const parallax = wide && !reduce;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);

  const state = revealed ? 'show' : 'hidden';

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Introduction"
      className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden bg-bg"
    >
      {/* Background: cinematic reveal + parallax */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -top-[8%] -z-10 h-[116%]"
        style={parallax ? { y } : undefined}
        initial={{ opacity: 0, scale: 1.12 }}
        animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.12 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <HeroMedia playVideo={playVideo} onFail={() => setFailed(true)} />
      </motion.div>

      {/* Readability overlays, tuned per theme */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-bg/95 via-bg/85 to-bg/65 dark:from-bg/95 dark:via-bg/65 dark:to-bg/20"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-bg/70 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-bg via-bg/60 to-transparent" />

      <div className="container-page relative pb-28 pt-36 sm:pb-32 md:pt-44">
        <motion.div variants={container} initial="hidden" animate={state} className="max-w-4xl">
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span aria-hidden="true" className="h-px w-10 bg-accent" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fg">
              <Ph>{trainer.name}</Ph>
            </p>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-muted sm:block" />
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted">
              <Ph>{trainer.designation}</Ph>
            </p>
          </motion.div>

          <h1 className="font-display-up mt-6 text-[clamp(3.4rem,12.5vw,9.5rem)]" aria-label={trainer.headline}>
            {trainer.headline.split(' ').map((w, i) => (
              <span key={`${w}-${i}`} aria-hidden="true" className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] align-bottom">
                <motion.span variants={word} className={`inline-block ${i === 1 ? 'text-accent' : ''}`}>
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p variants={fadeUp} className="mt-7 max-w-xl text-lg leading-relaxed text-fg/80 sm:text-xl">
            {trainer.heroIntro}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('pricing');
              }}
              className="btn btn-primary !px-8 !py-4 text-base"
            >
              Explore Programs <ArrowRight size={18} aria-hidden="true" />
            </MagneticButton>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('contact');
              }}
              className="btn btn-ghost !px-8 !py-4 text-base backdrop-blur-sm"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('about');
        }}
        aria-label="Scroll to About"
        className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit flex-col items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted transition-colors hover:text-fg sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        Scroll
        <span className="relative block h-12 w-px overflow-hidden bg-line/25">
          <span className="absolute inset-0 bg-accent motion-safe:animate-scroll-cue" />
        </span>
      </motion.a>
    </section>
  );
}
