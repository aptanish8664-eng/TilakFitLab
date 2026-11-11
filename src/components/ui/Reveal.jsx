import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Scroll-triggered entrance. Fires once. With reduced motion Framer drops the transform,
 * so content is simply visible.
 * direction: 'up' | 'down' | 'left' | 'right' | 'none'
 */
export default function Reveal({
  children,
  as = 'div',
  direction = 'up',
  delay = 0,
  distance = 28,
  duration = 0.8,
  amount = 0.2,
  className = '',
  ...rest
}) {
  const Tag = motion[as] ?? motion.div;
  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }[direction];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
