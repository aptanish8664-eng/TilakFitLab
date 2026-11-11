import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/** Parent: reveals once when scrolled into view and staggers its <StaggerItem> children. */
export function Stagger({ children, as = 'div', gap = 0.09, delay = 0, amount = 0.1, className = '', ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: '0px 0px -6% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, as = 'div', direction = 'up', distance = 26, className = '', ...rest }) {
  const Tag = motion[as] ?? motion.div;
  const offset = { up: { y: distance }, down: { y: -distance }, left: { x: distance }, right: { x: -distance }, none: {} }[direction];
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.75, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
