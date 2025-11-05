import { BrandInfo } from "@/lib/brandfetchApi";
export interface GroupedPortfolio {
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
  brandInfo?: BrandInfo;
}

export interface ChartDataItem {
  symbol: string;
  originalSymbol: string;
  value: number;
  currentValue: number;
  volume: number;
  percentage: string;
  fill: string;
  brandInfo?: BrandInfo;
}
