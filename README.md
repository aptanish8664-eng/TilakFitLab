# TilakFitLab

Static marketing site for **tilakfitlab.in**: React 18 + Vite, Tailwind CSS 3.4, Framer Motion, Lucide icons.
No backend. The contact form uses **Netlify Forms**, so it only works once the site is deployed on Netlify.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview    # serves dist/ at http://localhost:4173
```

> The contact form POSTs to `/`, which only Netlify handles. In `dev` and `preview` the form shows its
> normal "could not be sent" state. That is expected, not a bug.

## Where to edit content (all in `src/data/`)

| File | What it controls |
| --- | --- |
| `trainer.js` | Name, designation, hero headline, About text, certifications, specialisations, `stats` |
| `achievements.js` | Achievement / certificate cards (3 clearly-marked placeholders ship) |
| `videos.js` | Knowledge Hub categories and videos |
| `pricing.js` | The four packages, prices, features, "Most Popular" flag |
| `socialLinks.js` | Instagram / YouTube / Facebook / X URLs. Empty URL hides the icon |
| `site.js` | Brand, nav items, **WhatsApp number and message**, form name |

Anything in `[square brackets]` is a placeholder. It renders with a dashed underline so it can't be
mistaken for real content. Delete the brackets once you have written the real text.

`trainer.stats` is empty on purpose: the stats strip only appears when you add real numbers, e.g.
`{ label: 'Years coaching', value: 8, suffix: '+' }`.

### WhatsApp
Set `site.whatsapp.number` in `src/data/site.js` to country code + number, digits only (e.g. `919876543210`).
Until then the buttons render but the link will not open a real chat.

## Replacing images and videos

Drop a file with the **same name** into the same folder. No code change is needed.

| Path | Role |
| --- | --- |
| `src/assets/logo/logo.png` | Logo (any of svg/png/webp works if named `logo.*`). The logo is navy + blue, so dark mode shows it on a light plate |
| `src/assets/videos/intro.mp4` | Intro (plays muted at 1.5x, hard cap 4 s) |
| `src/assets/images/intro-poster.jpg` | Static frame used if the intro video cannot play |
| `src/assets/videos/hero.mp4` | Hero background loop (desktop only) |
| `src/assets/images/hero-poster.jpg` | Hero poster (shown on phones, reduced motion, data-saver, and while loading) |
| `src/assets/images/trainer.jpg` | About-section portrait (4:5 works best). Then set `photoIsPlaceholder: false` in `trainer.js` |
| `src/assets/images/achievement-fallback.jpg` | Card image for achievements without their own image |
| `src/assets/images/thumbs/<category-id>.jpg` | Default thumbnail per Knowledge Hub category |
| `public/og-image.jpg`, `public/favicon*`, `public/apple-touch-icon.png`, `public/icon-*.png` | Social preview and favicons |

Missing files never break the build: every media element has a fallback.

Recommended encoding for videos: H.264, `yuv420p`, `-movflags +faststart`
(e.g. `ffmpeg -i in.mp4 -c:v libx264 -crf 24 -pix_fmt yuv420p -movflags +faststart -an out.mp4`).

## Adding a Knowledge Hub video

Only `src/data/videos.js` changes.

1. **Local file:** put it in `src/assets/videos/`, then add
   ```js
   { id: 'squat-depth', title: 'Squat depth explained', category: 'exercise-techniques',
     description: 'One or two sentences.', duration: '8:42',
     thumbnail: 'squat.jpg',          // optional, file in src/assets/images/ (falls back to the category thumbnail)
     src: 'squat-depth.mp4', type: 'local' }
   ```
2. **YouTube / Vimeo / direct URL:** `type: 'external'` and `src: 'https://www.youtube.com/watch?v=...'`.
   YouTube links are converted to `youtube-nocookie` embeds, Vimeo to `player.vimeo.com`, and any other URL
   is played in a `<video>` tag.
3. `category` must be one of the ids in `categories` at the top of that file.

Local videos in `src/assets/videos/` are resolved by file name through a Vite glob and end up hashed in
`dist/assets/` (cached forever by `netlify.toml`). Library videos are never preloaded.

## Deploying to Netlify

1. Connect the repo. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
2. **Forms:** the form is declared statically in `index.html` and `public/forms.html` so Netlify detects it
   at build time. In the Netlify dashboard open *Forms > contact > Settings & usage > Form notifications*
   and add an email notification.
3. Add the custom domain `tilakfitlab.in` and enable HTTPS (Domain management).
4. There is deliberately no catch-all SPA rewrite, because it could swallow the form POST.

If you rename a field in `src/components/Contact.jsx`, rename it in `index.html` and `public/forms.html` too.
