import { memo } from 'react';
import { logoUrl } from '../../lib/assets';
import { site } from '../../data/site';

/**
 * The official logo is navy + blue on transparent. In dark mode the navy would disappear, so it
 * sits on a light plate (a container: the logo itself is never recoloured or altered).
 * If the logo file is missing it falls back to a plain wordmark.
 */
function Logo({ className = '', imgClassName = 'h-8', plate = true }) {
  const plateCls = plate
    ? 'dark:rounded-xl dark:bg-[#f1f4fa] dark:px-3 dark:py-1.5 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
    : '';
  return (
    <span className={`inline-flex items-center ${plateCls} ${className}`}>
      {logoUrl ? (
        <img src={logoUrl} alt={site.brand} className={`w-auto select-none ${imgClassName}`} draggable="false" />
      ) : (
        <span className="font-display text-2xl font-bold uppercase tracking-tight text-navy">
          Tilak<span className="text-brand">Fit</span>Lab
        </span>
      )}
    </span>
  );
}

export default memo(Logo);
