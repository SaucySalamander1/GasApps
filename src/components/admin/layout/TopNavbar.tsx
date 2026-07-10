"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoutButton } from "@/app/(admin)/(protected)/dashboard/LogoutButton";

interface TopNavbarProps {
  title?: string;
}

export default function TopNavbar({
  title = "Dashboard",
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-50 h-18 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-full items-center justify-between px-8">
        {/* Left */}
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              GasApps
            </h1>

            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Industrial Solutions
            </span>
          </div>

          <div className="hidden h-10 w-px bg-border lg:block" />

          <div className="hidden lg:block">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {title}
            </h2>

            <p className="text-sm text-muted-foreground">
              Administration Console
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}