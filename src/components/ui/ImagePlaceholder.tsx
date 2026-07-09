import { ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ImagePlaceholderProps {
  className?: string;
  label?: string;
}

export function ImagePlaceholder({ className, label }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'bg-surface border-border text-text-secondary flex flex-col items-center justify-center gap-2 border',
        className
      )}
    >
      <ImageIcon size={28} strokeWidth={1.5} />
      {label && <span className="text-xs">{label}</span>}
    </div>
  );
}
