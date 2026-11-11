import { Link as LinkIcon } from 'lucide-react';
import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from './BrandIcons';
import { socialLinks } from '../../data/socialLinks';

const ICONS = { instagram: InstagramIcon, youtube: YouTubeIcon, facebook: FacebookIcon, x: XIcon };

/** Renders only the profiles that have a URL in src/data/socialLinks.js. */
export default function SocialLinks({ className = '', size = 18 }) {
  const items = socialLinks.filter((s) => s.url && s.url.trim());
  if (!items.length) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {items.map((s) => {
        const Icon = ICONS[s.id] ?? LinkIcon;
        return (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.label} (opens in a new tab)`}
              title={s.label}
              className="grid h-11 w-11 place-items-center rounded-full border border-line/20 text-muted transition-[color,border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
            >
              <Icon size={size} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
