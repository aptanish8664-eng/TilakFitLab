import { isPlaceholder } from '../../lib/utils';

/**
 * Renders text from /src/data. Anything wrapped in [brackets] is shown in the clearly-marked
 * "placeholder" style so unfinished content can never be mistaken for the real thing.
 */
export default function Ph({ children, as: Tag = 'span', className = '' }) {
  const placeholder = isPlaceholder(children);
  return <Tag className={`${placeholder ? 'ph' : ''} ${className}`.trim()}>{children}</Tag>;
}
