import { cn } from '@/utils/cn';
import { Container } from '@/components/layout/Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  size?: 'default' | 'large';
  as?: 'section' | 'div';
}

export function Section({
  children,
  className,
  containerClassName,
  size = 'default',
  as: Component = 'section',
}: SectionProps) {
  return (
    <Component
      className={cn(
        size === 'large' ? 'py-(--space-section-y-lg)' : 'py-[var(--space-section-y)]',
        className
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </Component>
  );
}
