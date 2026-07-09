import { Container } from '@/components/layout/Container';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="border-border border-b py-16 md:py-20">
      <Container>
        <h1 className="font-display max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-text-secondary mt-4 max-w-xl text-base md:text-lg">{description}</p>
        )}
      </Container>
    </section>
  );
}
