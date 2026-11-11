import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// Words slide up from a mask. The trigger lives on the (unclipped) <h2>: an observer on the
// translated-away word itself would see zero visible area and never fire.
const wordVariants = {
  hidden: { y: '105%' },
  show: (i) => ({ y: 0, transition: { duration: 0.8, delay: i * 0.06, ease: EASE } }),
};

function MaskedWords({ text }) {
  return text.split(' ').map((word, i) => (
    <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span className="inline-block" variants={wordVariants} custom={i}>
        {word}
        {' '}
      </motion.span>
    </span>
  ));
}

export default function SectionHeading({ id, index, eyebrow, title, description, align = 'left', className = '' }) {
  const centered = align === 'center';
  return (
    <header className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <div className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}>
        <span className="eyebrow">
          {index && <span className="tabular-nums text-muted">{index}</span>}
          <span>{eyebrow}</span>
        </span>
        <motion.span
          aria-hidden="true"
          className="hairline h-px w-16 origin-left sm:w-28"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        />
      </div>
      <motion.h2
        id={id}
        className="font-display-up mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <MaskedWords text={title} />
      </motion.h2>
      {description && (
        <motion.p
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        >
          {description}
        </motion.p>
      )}
    </header>
  );
}
