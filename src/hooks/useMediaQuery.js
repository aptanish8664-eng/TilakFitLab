import { useEffect, useState } from 'react';

const get = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false);

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => get(query));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}
