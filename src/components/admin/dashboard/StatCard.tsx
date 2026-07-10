import { Card, CardContent } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
}

export default function StatCard({ title, value, suffix, icon: Icon }: StatCardProps) {
  return (
    <Card className="transition-colors hover:border-accent/40">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="rounded-md bg-accent/10 p-2.5">
            <Icon className="h-4.5 w-4.5 text-accent" strokeWidth={2} />
          </div>
        </div>

        <h3 className="text-sm text-text-secondary">{title}</h3>

        <p className="mt-1.5 font-mono text-3xl font-semibold tracking-tight text-text-primary">
          {value.toLocaleString()}
          {suffix && <span className="ml-1 text-lg text-text-secondary">{suffix}</span>}
        </p>
      </CardContent>
    </Card>
  );
}