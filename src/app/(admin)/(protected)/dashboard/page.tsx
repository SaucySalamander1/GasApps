import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/dashboard-stats";

import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import AnalyticsSection from "@/components/admin/dashboard/charts/AnalyticsSection";

export default async function DashboardPage() {
  // Auth is already enforced by the (protected) layout above this page;
  // we just read the session here to greet the admin by name.
  const session = await getSession();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <DashboardHeader userName={session?.name} />
      <StatsGrid stats={stats} />
      <AnalyticsSection stats={stats} />
    </div>
  );
}