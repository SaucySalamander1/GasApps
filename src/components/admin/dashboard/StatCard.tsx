"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  const positive = change >= 0;

  return (
    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              positive
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}

            {Math.abs(change)}%
          </div>
        </div>

        <h3 className="text-sm text-muted-foreground">
          {title}
        </h3>

        <p className="mt-2 text-3xl font-bold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}