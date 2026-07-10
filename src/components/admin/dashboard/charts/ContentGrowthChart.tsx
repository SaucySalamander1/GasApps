"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import type { MonthlyGrowth } from "@/lib/dashboard-stats";

interface ContentGrowthChartProps {
  data: MonthlyGrowth[];
}

export default function ContentGrowthChart({ data }: ContentGrowthChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Content Growth</CardTitle>
        <CardDescription>New items added across the site, last 6 months</CardDescription>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1858C8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1858C8" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-text-secondary)" fontSize={12} />
            <YAxis stroke="var(--color-text-secondary)" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <Area
              type="monotone"
              dataKey="items"
              name="Items added"
              stroke="#1858C8"
              strokeWidth={2.5}
              fill="url(#growthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}