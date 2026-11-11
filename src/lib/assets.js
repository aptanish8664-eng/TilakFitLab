// Media resolver. Everything in src/assets is indexed with a glob, so a missing file never
// breaks the build: callers just get `null` and render their fallback.
//
// (Relative glob on purpose: absolute '/src/...' globs break on Windows when the drive letter case differs.)
//
// To replace a stand-in, drop a file with the SAME NAME into the same folder
// (e.g. src/assets/videos/hero.mp4). No code changes needed.

const urls = import.meta.glob('../assets/**/*.{mp4,webm,jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const index = new Map(Object.entries(urls).map(([key, url]) => [key.replace('../assets/', ''), url]));

const EXTENSIONS = ['svg', 'png', 'webp', 'avif', 'jpg', 'jpeg', 'mp4', 'webm'];

/** Exact path below src/assets, e.g. asset('videos/intro.mp4'). */
export function asset(path) {
  return index.get(path) ?? null;
}

/** Path without extension, e.g. assetByBase('logo/logo') finds logo.svg, logo.png, ... */
export function assetByBase(base) {
  for (const ext of EXTENSIONS) {
    const hit = index.get(`${base}.${ext}`);
    if (hit) return hit;
  }
  return null;
}

const isAbsolute = (ref) => /^(https?:)?\/\//i.test(ref) || ref.startsWith('/') || ref.startsWith('data:');

/**
 * Resolve a reference coming from a data file.
 *  - 'sample.mp4'            -> src/assets/<folder>/sample.mp4
 *  - 'thumbs/x.jpg'          -> src/assets/<folder>/thumbs/x.jpg (or src/assets/thumbs/x.jpg)
 *  - 'https://...' or '/x'   -> used as given (remote URL, or a file inside /public)
 */
export function resolveMedia(ref, folder) {
  if (!ref || typeof ref !== 'string') return null;
  if (isAbsolute(ref)) return ref;
  return (folder && asset(`${folder}/${ref}`)) || asset(ref) || null;
}

export const logoUrl = assetByBase('logo/logo');
export const logoMarkUrl = assetByBase('logo/logo-mark');
export const introVideoUrl = assetByBase('videos/intro');
export const heroVideoUrl = assetByBase('videos/hero');
export const introPosterUrl = assetByBase('images/intro-poster');
export const heroPosterUrl = assetByBase('images/hero-poster');
export const trainerPhotoUrl = assetByBase('images/trainer');
export const achievementFallbackUrl = assetByBase('images/achievement-fallback');
export const categoryThumbUrl = (categoryId) => asset(`images/thumbs/${categoryId}.jpg`);
