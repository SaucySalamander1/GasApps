import { Target, Eye } from 'lucide-react';
import { Container } from '@/components/layout/Container';

export function MissionVision() {
  return (
    <section className="bg-surface/50 py-[var(--space-section-y)]">
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="border-border bg-background rounded-lg border p-8">
          <div className="bg-accent/10 text-accent flex h-12 w-12 items-center justify-center rounded-lg">
            <Target size={24} />
          </div>
          <h3 className="font-display mt-4 text-xl font-semibold">Our Mission</h3>
          <p className="text-text-secondary mt-3 text-sm leading-relaxed">
            To supply industrial gas fittings and instrumentation engineered to the highest
            standards of precision and safety — backed by real engineering support, not just a
            product catalog.
          </p>
        </div>

        <div className="border-border bg-background rounded-lg border p-8">
          <div className="bg-accent/10 text-accent flex h-12 w-12 items-center justify-center rounded-lg">
            <Eye size={24} />
          </div>
          <h3 className="font-display mt-4 text-xl font-semibold">Our Vision</h3>
          <p className="text-text-secondary mt-3 text-sm leading-relaxed">
            To be the most trusted engineering partner in industrial gas systems — known for
            reliability in the environments where failure is not an option.
          </p>
        </div>
      </Container>
    </section>
  );
}
