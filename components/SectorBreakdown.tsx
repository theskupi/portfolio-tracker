export type SectorLabel =
  | "Energy"
  | "Materials"
  | "Industrials"
  | "Utilities"
  | "Healthcare"
  | "Financials"
  | "Consumer Discretionary"
  | "Consumer Staples"
  | "Information Technology"
  | "Communication Services"
  | "Real Estate";

// Ideal sector weight ranges
const IDEAL_SECTOR_WEIGHTS: Record<SectorLabel, string> = {
  "Energy": "3-8%",
  "Materials": "2-6%",
  "Industrials": "8-11%",
  "Utilities": "2-5%",
  "Healthcare": "12-14%",
  "Financials": "10-14%",
  "Consumer Discretionary": "10-12%",
  "Consumer Staples": "6-9%",
  "Information Technology": "20-27%",
  "Communication Services": "8-11%",
  "Real Estate": "3-6%",
};

interface SectorBreakdownProps {
  sectorPercentages: Record<SectorLabel, number>;
}

// Helper function to check if a percentage is within the ideal range
function isWithinIdealRange(actual: number, idealRange: string): boolean {
  const match = idealRange.match(/(\d+)-(\d+)%/);
  if (!match) return false;
  const min = parseFloat(match[1]);
  const max = parseFloat(match[2]);
  return actual >= min && actual <= max;
}

export function SectorBreakdown({ sectorPercentages }: SectorBreakdownProps) {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted/30">
      <h4 className="text-sm font-semibold mb-3">Sector Breakdown</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {(
          [
            "Energy",
            "Materials",
            "Industrials",
            "Utilities",
            "Healthcare",
            "Financials",
            "Consumer Discretionary",
            "Consumer Staples",
            "Information Technology",
            "Communication Services",
            "Real Estate",
          ] as SectorLabel[]
        ).map((sector) => {
          const actualPercentage = sectorPercentages[sector] || 0;
          const idealRange = IDEAL_SECTOR_WEIGHTS[sector];
          const isInRange = isWithinIdealRange(actualPercentage, idealRange);
          
          return (
            <div key={sector} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                {sector}
              </div>
              <div className="text-lg font-semibold">
                {actualPercentage.toFixed(1)}%
              </div>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                  isInRange 
                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" 
                    : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                }`}>
                  Ideal: {idealRange}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
