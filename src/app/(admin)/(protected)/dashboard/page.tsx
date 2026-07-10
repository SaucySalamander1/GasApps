import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import AnalyticsSection from "@/components/admin/dashboard/charts/AnalyticsSection";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <DashboardHeader userName={session.name} />

      <StatsGrid />

      <AnalyticsSection />
    </div>
  );
}