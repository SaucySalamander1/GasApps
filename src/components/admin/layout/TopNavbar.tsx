"use client";

import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoutButton } from "@/app/(admin)/(protected)/dashboard/LogoutButton";

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 h-18 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-medium tracking-wide text-text-secondary uppercase sm:inline-block">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}