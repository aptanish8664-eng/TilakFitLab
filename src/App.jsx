import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { ContactProvider } from './context/ContactContext';
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import KnowledgeHub from './components/KnowledgeHub';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Intro lifecycle lives HERE, in React state only (no storage): it plays once per page load and
// is not retriggered by hash changes or in-page navigation.
//   'intro'   -> overlay playing; page mounted underneath but inert
//   'exiting' -> overlay leaving; hero entrance animations start now
//   'done'    -> overlay unmounted
export default function App() {
  const [phase, setPhase] = useState('intro');
  const shellRef = useRef(null);

  const onExitStart = useCallback(() => setPhase((p) => (p === 'intro' ? 'exiting' : p)), []);
  const onDone = useCallback(() => setPhase('done'), []);

  // Keep the page behind the intro out of the tab order / accessibility tree until it leaves.
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    if (phase === 'intro') el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  }, [phase]);

  // Failsafe: whatever happens inside the intro, the site must never stay covered.
  useEffect(() => {
    const t = window.setTimeout(() => setPhase('done'), 9000);
    return () => window.clearTimeout(t);
  }, []);

  const revealed = phase !== 'intro';

  return (
    <ThemeProvider>
      <ContactProvider>
        <MotionConfig reducedMotion="user">
          <div ref={shellRef} className="relative">
            <a
              href="#main"
              className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-0"
            >
              Skip to content
            </a>
            <Navbar revealed={revealed} />
            <main id="main" tabIndex={-1} className="outline-none">
              <Hero revealed={revealed} />
              <About />
              <Achievements />
              <KnowledgeHub />
              <Pricing />
              <Contact />
            </main>
            <Footer />
            <WhatsAppButton visible={phase === 'done'} />
          </div>

          <AnimatePresence>
            {phase !== 'done' && <IntroAnimation key="intro" onExitStart={onExitStart} onDone={onDone} />}
          </AnimatePresence>
        </MotionConfig>
      </ContactProvider>
    </ThemeProvider>
  );
}
