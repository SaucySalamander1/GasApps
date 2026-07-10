import RevenueChart from "./RevenueChart";
import VisitorsChart from "./VisitorChart";

export default function AnalyticsSection() {
  return (
    <section className="grid gap-6 xl:grid-cols-5">
      <div className="xl:col-span-3">
        <RevenueChart />
      </div>

      <div className="xl:col-span-2">
        <VisitorsChart />
      </div>
    </section>
  );
}