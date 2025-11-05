"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GroupedPortfolio, ChartDataItem } from "@/types/portfolio";

import { generateColor } from "@/lib/utils";

// Helper to create gradient from a base color
const createGradient = (baseColor: string, index: number) => {
  // Simple brightness adjustment for gradient effect
  const adjustBrightness = (hex: string, factor: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    
    const r = Math.min(255, Math.max(0, Math.round(parseInt(result[1], 16) * factor)));
    const g = Math.min(255, Math.max(0, Math.round(parseInt(result[2], 16) * factor)));
    const b = Math.min(255, Math.max(0, Math.round(parseInt(result[3], 16) * factor)));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return {
    id: `gradient-${index}`,
    lighter: adjustBrightness(baseColor, 1.3),
    base: baseColor,
    darker: adjustBrightness(baseColor, 0.7),
  };
};

interface PortfolioChartProps {
  groupedData: GroupedPortfolio[];
  chartData: ChartDataItem[];
  totalPortfolioValue: number;
}

export function PortfolioChart({
  groupedData,
  chartData,
  totalPortfolioValue,
}: PortfolioChartProps) {
  if (groupedData.length === 0) return null;

  // Create chart config dynamically
  const chartConfig = groupedData.reduce((config, item, index) => {
    config[item.symbol] = {
      label: item.symbol,
      color: generateColor(index),
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Portfolio Distribution</CardTitle>
        <CardDescription>
          Value distribution across {groupedData.length} symbols • Total: $
          {totalPortfolioValue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
          >
            <defs>
              {chartData.map((item, index) => {
                const gradient = createGradient(item.fill, index);
                return (
                  <linearGradient
                    key={gradient.id}
                    id={gradient.id}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={gradient.lighter} />
                    <stop offset="50%" stopColor={gradient.base} />
                    <stop offset="100%" stopColor={gradient.darker} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="symbol"
              width={60}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    const payload = item.payload;
                    const payloadIndex = chartData.indexOf(payload);
                    const gradient = createGradient(payload.fill, payloadIndex);
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-sm"
                            style={{ background: `linear-gradient(90deg, ${gradient.lighter}, ${gradient.base}, ${gradient.darker})` }}
                          />
                          <span className="font-semibold">
                            {payload.symbol}
                          </span>
                        </div>
                        <span className="text-sm">
                          Value: ${payload.currentValue.toFixed(2)}
                        </span>
                        <span className="text-sm">
                          Percentage: {payload.percentage}%
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => {
                const gradient = createGradient(entry.fill, index);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${gradient.id})`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
