export interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export interface StockData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export async function fetchStockQuote(
  symbol: string
): Promise<StockData | null> {
  try {
    const response = await fetch(
      `/api/stock-quote?symbol=${encodeURIComponent(symbol)}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch quote for ${symbol}:`,
        response.status,
        errorText
      );
      return null;
    }

    const data: StockQuote = await response.json();

    return {
      symbol,
      currentPrice: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

export async function fetchMultipleStockQuotes(
  symbols: string[]
): Promise<Map<string, StockData>> {
  const stockDataMap = new Map<string, StockData>();

  // Fetch all quotes in parallel
  const promises = symbols.map((symbol) => fetchStockQuote(symbol));
  const results = await Promise.all(promises);

  results.forEach((data) => {
    if (data) {
      stockDataMap.set(data.symbol, data);
    }
  });

  return stockDataMap;
}
