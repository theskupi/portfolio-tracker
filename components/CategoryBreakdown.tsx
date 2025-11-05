"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type CategoryLabel =
  | "Staple"
  | "Mature Growth"
  | "High Growth"
  | "High Risk";

interface CategoryBreakdownProps {
  categoryPercentages: Record<CategoryLabel, number>;
}

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "#f72585",
  },
} satisfies ChartConfig;

export function CategoryBreakdown({
  categoryPercentages,
}: CategoryBreakdownProps) {
  // Transform data for radar chart
  const chartData = [
    {
      category: "Staple",
      percentage: categoryPercentages["Staple"] || 0,
    },
    {
      category: "Mature Growth",
      percentage: categoryPercentages["Mature Growth"] || 0,
    },
    {
      category: "High Growth",
      percentage: categoryPercentages["High Growth"] || 0,
    },
    {
      category: "High Risk",
      percentage: categoryPercentages["High Risk"] || 0,
    },
  ];

  return (
    <ChartContainer config={chartConfig} className="mx-auto">
      <RadarChart data={chartData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="category" />
        <PolarGrid />
        <Radar
          dataKey="percentage"
          fill="var(--color-percentage)"
          fillOpacity={0.6}
          stroke="var(--color-percentage)"
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  );
}
