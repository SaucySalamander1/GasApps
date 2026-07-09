import Link from 'next/link';
import { Flame } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('font-display flex items-center gap-2 text-lg font-semibold', className)}
    >
      <Flame size={22} className="text-accent" strokeWidth={2.25} />
      {!iconOnly && <span>GasApps</span>}
    </Link>
  );
}
