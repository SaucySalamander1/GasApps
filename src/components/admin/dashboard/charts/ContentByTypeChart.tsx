"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import type { ContentTypeCount } from "@/lib/dashboard-stats";

interface ContentByTypeChartProps {
  data: ContentTypeCount[];
}

const BAR_COLOR = "#1858C8";
const BAR_COLOR_EMPTY = "var(--color-border)";

export default function ContentByTypeChart({ data }: ContentByTypeChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Content by Type</CardTitle>
        <CardDescription>What&apos;s currently in the database</CardDescription>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis type="number" stroke="var(--color-text-secondary)" fontSize={12} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="label"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              width={90}
            />
            <Tooltip
              cursor={{ fill: "var(--color-surface)" }}
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="count" name="Items" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell key={entry.label} fill={entry.count > 0 ? BAR_COLOR : BAR_COLOR_EMPTY} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}