import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tfl-theme';
const META_COLOR = { dark: '#05070f', light: '#f5f7fb' };

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

// The inline script in index.html has already set the class before React runs.
const readInitial = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light';

function applyTheme(theme, animate) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 450);
  }
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute('content', META_COLOR[theme]));
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitial);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode / blocked storage: the choice just won't persist */
      }
      return next;
    });
  }, []);

  // Until the visitor chooses, follow the operating system if it changes.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return undefined;
    const onChange = (e) => {
      let stored = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      if (stored) return;
      const next = e.matches ? 'dark' : 'light';
      applyTheme(next, true);
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
