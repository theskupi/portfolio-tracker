"use client";

import { Pie, PieChart } from "recharts";
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

const CATEGORY_COLORS = ["#f1faee", "#a8dadc", "#457b9d", "#1d3557", "#e63946"];

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: CATEGORY_COLORS[4],
  },
  staple: {
    label: "Staple",
    color: CATEGORY_COLORS[0],
  },
  matureGrowth: {
    label: "Mature Growth",
    color: CATEGORY_COLORS[1],
  },
  highGrowth: {
    label: "High Growth",
    color: CATEGORY_COLORS[2],
  },
  highRisk: {
    label: "High Risk",
    color: CATEGORY_COLORS[4],
  },
} satisfies ChartConfig;

export function CategoryBreakdown({
  categoryPercentages,
}: CategoryBreakdownProps) {
  const pieData = [
    {
      category: "Staple",
      percentage: categoryPercentages["Staple"] || 0,
      fill: CATEGORY_COLORS[0],
    },
    {
      category: "Mature Growth",
      percentage: categoryPercentages["Mature Growth"] || 0,
      fill: CATEGORY_COLORS[1],
    },
    {
      category: "High Growth",
      percentage: categoryPercentages["High Growth"] || 0,
      fill: CATEGORY_COLORS[2],
    },
    {
      category: "High Risk",
      percentage: categoryPercentages["High Risk"] || 0,
      fill: CATEGORY_COLORS[3],
    },
  ];

  const hasData = Object.keys(categoryPercentages).length > 0;

  return (
    <div className="space-y-6">
      {hasData ? (
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="percentage"
              nameKey="category"
              innerRadius={60}
              outerRadius={80}
              label={({ category, percentage }) =>
                `${category}: ${percentage.toFixed(1)}%`
              }
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>
      ) : (
        <div className="mt-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-muted-foreground text-sm mb-2">
              No category data available
            </p>
            <p className="text-muted-foreground text-xs">
              Assign categories to your symbols in the table above to see the
              breakdown
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
