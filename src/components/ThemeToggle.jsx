import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/** Pill switch: the knob slides, and the sun/moon glyph rotates through it. */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className={`relative h-9 w-[4.25rem] shrink-0 rounded-full border border-line/20 bg-soft/80 p-[3px] transition-colors hover:border-accent/60 ${className}`}
    >
      <Sun aria-hidden="true" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
      <Moon aria-hidden="true" size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />
      <motion.span
        aria-hidden="true"
        className="relative grid h-7 w-7 place-items-center rounded-full bg-accent-strong text-white shadow-md"
        initial={false}
        animate={{ x: dark ? 32 : 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      >
        <motion.span
          className="grid place-items-center"
          initial={false}
          animate={{ rotate: dark ? 360 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {dark ? <Moon size={14} /> : <Sun size={14} />}
        </motion.span>
      </motion.span>
    </button>
  );
}
