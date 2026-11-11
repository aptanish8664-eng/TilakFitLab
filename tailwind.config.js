/** @type {import('tailwindcss').Config} */
// Colours are CSS variables (see src/index.css) so dark/light palettes live in one place.
// The accent (#155ade) is sampled from the TilakFitLab logo.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        soft: token('soft'),
        fg: token('fg'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        'accent-strong': token('accent-strong'),
        navy: '#0a1230',
        brand: { DEFAULT: '#155ade', navy: '#0a1230' },
        whatsapp: '#25d366',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'Impact', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { page: '80rem' },
      letterSpacing: { wider2: '0.18em' },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '70%, 100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        'scroll-cue': {
          '0%': { transform: 'translateY(-100%)' },
          '60%, 100%': { transform: 'translateY(100%)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%,-3%,0) scale(1.08)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 6s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.2,0.6,0.3,1) infinite',
        'scroll-cue': 'scroll-cue 2s cubic-bezier(0.65,0,0.35,1) infinite',
        drift: 'drift 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
