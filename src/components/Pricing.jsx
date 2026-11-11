import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';
import { Stagger } from './ui/Stagger';
import PricingCard from './PricingCard';
import { packages } from '../data/pricing';
import { useContact } from '../context/ContactContext';

export default function Pricing() {
  const { choosePackage } = useContact();

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-pad relative overflow-hidden bg-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[60rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="container-page relative">
        <SectionHeading
          id="pricing-title"
          index="04"
          eyebrow="Training Programs"
          title="Choose your program"
          description="Four ways to train with TilakFitLab. Pick the one that fits your goal and I will tailor the details with you."
        />

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4" gap={0.1}>
          {packages.map((pkg) => (
            <PricingCard key={pkg.id} pkg={pkg} onChoose={choosePackage} />
          ))}
        </Stagger>

        <Reveal className="mt-12 text-center text-sm text-muted" delay={0.1}>
          Not sure which one fits?{' '}
          <button
            type="button"
            onClick={() => choosePackage('not-sure')}
            className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
          >
            Book a consultation
          </button>{' '}
          and we will work it out together.
        </Reveal>
      </div>
    </section>
  );
}
