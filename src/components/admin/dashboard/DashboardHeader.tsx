"use client";

import { Button } from "@/components/ui/Button";
import { Plus, Download, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  userName?: string;
}

export default function DashboardHeader({
  title = "Executive Command Center",
  description = "Monitor your business, analytics, clients, products, and marketing performance from one place.",
  userName = "Admin",
}: DashboardHeaderProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <span className="text-sm font-medium text-muted-foreground">
          {greeting}, {userName} 👋
        </span>

        <h1 className="font-display text-4xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
    </section>
  );
}