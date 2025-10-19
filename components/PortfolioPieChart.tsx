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
import { GroupedPortfolio } from "@/types/portfolio";
import { PortfolioAllocationTable } from "./PortfolioAllocationTable";

interface PortfolioPieChartProps {
  groupedData: GroupedPortfolio[];
}

const CUSTOM_PALETTE = [
  "#A6CEE3",
  "#1F78B4",
  "#B2DF8A",
  "#33A02C",
  "#FB9A99",
  "#E31A1C",
  "#FDBF6F",
  "#FF7F00",
  "#CAB2D6",
  "#6A3D9A",
  "#FFFF99",
  "#B15928",
  "#8DD3C7",
  "#FFFFB3",
  "#BEBADA",
  "#FB8072",
  "#80B1D3",
  "#FDB462",
  "#B3DE69",
  "#FCCDE5",
];

// Convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Adjust color brightness (factor > 1 = lighter, < 1 = darker)
const adjustBrightness = (hex: string, factor: number): string => {
  const rgb = hexToRgb(hex);
  const adjust = (value: number) =>
    Math.min(255, Math.max(0, Math.round(value * factor)));

  const r = adjust(rgb.r).toString(16).padStart(2, "0");
  const g = adjust(rgb.g).toString(16).padStart(2, "0");
  const b = adjust(rgb.b).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
};

// Generate color from palette with lighter/darker shades if needed
const generateColor = (index: number): string => {
  if (index < CUSTOM_PALETTE.length) {
    return CUSTOM_PALETTE[index];
  }

  // For additional colors, use lighter/darker shades of the palette
  const baseIndex = index % CUSTOM_PALETTE.length;
  const baseColor = CUSTOM_PALETTE[baseIndex];
  const cycle = Math.floor(index / CUSTOM_PALETTE.length);

  // Alternate between lighter and darker shades
  const factor = cycle % 2 === 0 ? 1.3 : 0.7; // Lighter or darker
  return adjustBrightness(baseColor, factor);
};

export function PortfolioPieChart({ groupedData }: PortfolioPieChartProps) {
  if (groupedData.length === 0) return null;

  // Calculate total portfolio value
  const totalPortfolioValue = groupedData.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );

  // Transform data for bar chart (by total value)
  const chartData = groupedData
    .map((item, index) => {
      const cleanSymbol = item.symbol.replace(".US", "");
      const currentValue = item.currentValue || item.totalValue;
      return {
        symbol: cleanSymbol,
        originalSymbol: item.symbol,
        value: item.totalValue,
        currentValue: currentValue,
        volume: item.totalVolume,
        percentage: ((item.totalValue / totalPortfolioValue) * 100).toFixed(1),
        fill: generateColor(index),
      };
    })
    .sort((a, b) => b.value - a.value);

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
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Distribution</CardTitle>
        <CardDescription>
          Value distribution across {groupedData.length} symbols • Total: $
          {totalPortfolioValue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full"
        >
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
                          <span className="font-semibold">{payload.symbol}</span>
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

        {/* Portfolio Allocation Table */}
        <PortfolioAllocationTable chartData={chartData} />
      </CardContent>
    </Card>
  );
}
