import ContentGrowthChart from "./ContentGrowthChart";
import ContentByTypeChart from "./ContentByTypeChart";
import type { DashboardStats } from "@/lib/dashboard-stats";

interface AnalyticsSectionProps {
  stats: DashboardStats;
}

export default function AnalyticsSection({ stats }: AnalyticsSectionProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-5">
      <div className="xl:col-span-3">
        <ContentGrowthChart data={stats.monthlyGrowth} />
      </div>

      <div className="xl:col-span-2">
        <ContentByTypeChart data={stats.contentByType} />
      </div>
    </section>
  );
}