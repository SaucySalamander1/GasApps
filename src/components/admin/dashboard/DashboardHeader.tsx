"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
}

export default function DashboardHeader({ userName = "Admin" }: DashboardHeaderProps) {
  const router = useRouter();
  const hour = new Date().getHours();

  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1.5">
        <span className="text-sm font-medium text-text-secondary">
          {greeting}, {userName}
        </span>

        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">
          Dashboard
        </h1>

        <p className="max-w-xl text-sm text-text-secondary">
          A live view of your site&apos;s content — products, services, and everything you manage.
        </p>
      </div>

      <Button variant="outline" onClick={() => router.refresh()}>
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        Refresh
      </Button>
    </section>
  );
}