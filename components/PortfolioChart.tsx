"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
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
    const cleanSymbol = item.symbol.replace(".US", "");
    config[cleanSymbol] = {
      label: cleanSymbol,
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
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: payload.fill }}
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
            <Bar dataKey="value" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
