"use client";

import { Pie, PieChart } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface GroupedPortfolio {
  symbol: string;
  totalVolume: number;
  positions: Array<{
    symbol: string;
    volume: string;
    openPrice: string;
  }>;
  averageOpenPrice: number;
  totalValue: number;
  currentPrice?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
}

interface PortfolioPieChartProps {
  groupedData: GroupedPortfolio[];
}

const CUSTOM_PALETTE = [
  "#001219",
  "#005f73",
  "#0a9396",
  "#94d2bd",
  "#e9d8a6",
  "#ee9b00",
  "#ca6702",
  "#bb3e03",
  "#ae2012",
  "#9b2226",
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
  const adjust = (value: number) => Math.min(255, Math.max(0, Math.round(value * factor)));
  
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
  const totalPortfolioValue = groupedData.reduce((sum, item) => sum + item.totalValue, 0);

  // Transform data for pie chart (by total value)
  const chartData = groupedData.map((item, index) => ({
    symbol: item.symbol,
    value: item.totalValue,
    percentage: ((item.totalValue / totalPortfolioValue) * 100).toFixed(1),
    fill: generateColor(index),
  }));

  // Create chart config dynamically
  const chartConfig = groupedData.reduce((config, item, index) => {
    config[item.symbol] = {
      label: item.symbol,
      color: generateColor(index),
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Distribution</CardTitle>
        <CardDescription>
          Value distribution across {groupedData.length} symbols • Total: ${totalPortfolioValue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="symbol"
                  hideLabel
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="symbol"
              label={({ symbol, percentage }) => `${symbol}: ${percentage}%`}
              labelLine={false}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="symbol" />}
              className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
