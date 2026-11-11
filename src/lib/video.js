// Turns a pasted video URL into something we can play.
//   YouTube       -> privacy-friendly youtube-nocookie embed (iframe)
//   Vimeo         -> player.vimeo.com embed (iframe, do-not-track)
//   anything else -> treated as a direct file and played in a <video>

const YT_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
];

function youtubeId(u) {
  if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
  if (!YT_HOSTS.includes(u.hostname)) return null;
  if (u.pathname === '/watch') return u.searchParams.get('v');
  const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
  return m ? m[1] : null;
}

function vimeoId(u) {
  if (!/(^|\.)vimeo\.com$/.test(u.hostname)) return null;
  const m = u.pathname.match(/\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

/** @returns {{kind:'iframe', src:string}|{kind:'file', src:string}} */
export function toPlayable(rawUrl) {
  try {
    const u = new URL(rawUrl, window.location.origin);
    const yt = youtubeId(u);
    if (yt) {
      return {
        kind: 'iframe',
        src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      };
    }
    const vm = vimeoId(u);
    if (vm) {
      return { kind: 'iframe', src: `https://player.vimeo.com/video/${vm}?autoplay=1&dnt=1` };
    }
  } catch {
    /* not a parsable URL: fall through to file */
  }
  return { kind: 'file', src: rawUrl };
}
