import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function AdminHeader() {
  return (
    <header className="border-border bg-background sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-text-secondary border-border border-l pl-3 text-sm font-medium">
            Admin
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}