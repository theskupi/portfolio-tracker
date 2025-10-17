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
}
