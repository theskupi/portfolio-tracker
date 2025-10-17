import * as XLSX from "xlsx";

export interface PortfolioRow {
  symbol: string;
  volume: string;
  openPrice: string;
}

export interface GroupedPortfolio {
  symbol: string;
  totalVolume: number;
  positions: PortfolioRow[];
  averageOpenPrice: number;
  totalValue: number;
  currentPrice?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
}

export function parseXLSXFile(file: File): Promise<PortfolioRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Find the "OPEN POSITION" sheet
        const targetSheetName = workbook.SheetNames.find((name) =>
          name.toUpperCase().includes("OPEN POSITION")
        );

        if (!targetSheetName) {
          reject(new Error("Could not find 'OPEN POSITION' sheet"));
          return;
        }

        const worksheet = workbook.Sheets[targetSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length === 0) {
          reject(new Error("No data found in worksheet"));
          return;
        }

        // Find the header row
        let headerRowIndex = -1;
        let headers: string[] = [];

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (
            row &&
            row.some(
              (cell: any) =>
                cell &&
                typeof cell === "string" &&
                cell.toLowerCase() === "symbol"
            )
          ) {
            headerRowIndex = i;
            headers = row;
            break;
          }
        }

        if (headerRowIndex === -1) {
          reject(new Error("Could not find header row with 'Symbol' column"));
          return;
        }

        // Find column indices
        const symbolIndex = headers.findIndex(
          (h: string) =>
            h && typeof h === "string" && h.toLowerCase().includes("symbol")
        );
        const volumeIndex = headers.findIndex(
          (h: string) =>
            h && typeof h === "string" && h.toLowerCase().includes("volume")
        );
        const openPriceIndex = headers.findIndex(
          (h: string) =>
            h &&
            typeof h === "string" &&
            (h.toLowerCase().includes("open price") ||
              h.toLowerCase().includes("open_price"))
        );

        // Extract data rows
        const rows: PortfolioRow[] = (jsonData as any[])
          .slice(headerRowIndex + 1)
          .filter(
            (row: any[]) =>
              row &&
              row.length > 0 &&
              row[symbolIndex] &&
              row[symbolIndex] !== "Total"
          )
          .map((row: any[]) => ({
            symbol: row[symbolIndex]?.toString() || "",
            volume: row[volumeIndex]?.toString() || "",
            openPrice: row[openPriceIndex]?.toString() || "",
          }));

        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsBinaryString(file);
  });
}

export function groupPortfolioData(data: PortfolioRow[]): GroupedPortfolio[] {
  const grouped = data.reduce((acc, row) => {
    const existing = acc.find((item) => item.symbol === row.symbol);

    if (existing) {
      existing.positions.push(row);
      existing.totalVolume += parseFloat(row.volume) || 0;
    } else {
      acc.push({
        symbol: row.symbol,
        totalVolume: parseFloat(row.volume) || 0,
        positions: [row],
        averageOpenPrice: 0,
        totalValue: 0,
      });
    }

    return acc;
  }, [] as GroupedPortfolio[]);

  // Calculate average open price and total value for each group
  grouped.forEach((group) => {
    const totalWeightedPrice = group.positions.reduce((sum, pos) => {
      const volume = parseFloat(pos.volume) || 0;
      const price = parseFloat(pos.openPrice) || 0;
      return sum + volume * price;
    }, 0);
    
    group.averageOpenPrice =
      group.totalVolume > 0 ? totalWeightedPrice / group.totalVolume : 0;
    group.totalValue = totalWeightedPrice;
  });

  return grouped;
}
