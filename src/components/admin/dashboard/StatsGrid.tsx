import StatCard from "./StatCard";
import { Package, Wrench, Newspaper, Briefcase } from "lucide-react";
import type { DashboardStats } from "@/lib/dashboard-stats";

interface StatsGridProps {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    { title: "Products", value: stats.totalProducts, icon: Package },
    { title: "Services", value: stats.totalServices, icon: Wrench },
    { title: "Blog Posts", value: stats.publishedPosts, icon: Newspaper },
    { title: "Open Roles", value: stats.openRoles, icon: Briefcase },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
      ))}
    </section>
  );
}