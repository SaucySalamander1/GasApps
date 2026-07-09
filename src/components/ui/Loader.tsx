import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LoaderProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Loader({ size = 20, className, label = 'Loading' }: LoaderProps) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2', className)}>
      <Loader2 size={size} className="text-accent animate-spin" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
