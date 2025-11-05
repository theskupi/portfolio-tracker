"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CategoryBreakdown, CategoryLabel } from "./CategoryBreakdown";
import { SectorBreakdown, SectorLabel } from "./SectorBreakdown";

interface ChartDataItem {
  symbol: string;
  originalSymbol: string;
  percentage: string;
}

// Define symbol categories - customize these mappings as needed
const SYMBOL_CATEGORIES: Record<string, CategoryLabel> = {
  // Add your symbol mappings here, for example:
  // "AAPL": "Mature Growth",
  // "MSFT": "Mature Growth",
  // "NVDA": "High Growth",
  // "TSLA": "High Risk",
  // "KO": "Staple",
  // "PG": "Staple",
};

// Define symbol sectors - customize these mappings as needed
const SYMBOL_SECTORS: Record<string, SectorLabel> = {
  // Add your symbol sector mappings here, for example:
  // "AAPL": "Information Technology",
  // "MSFT": "Information Technology",
  // "XOM": "Energy",
  // "JPM": "Financials",
};

interface PortfolioAllocationTableProps {
  chartData: ChartDataItem[];
}

const CATEGORIES_STORAGE_KEY = "portfolio-tracker-categories";
const SECTORS_STORAGE_KEY = "portfolio-tracker-sectors";

export function PortfolioAllocationTable({
  chartData,
}: PortfolioAllocationTableProps) {
  const [copied, setCopied] = useState(false);
  const [symbolCategories, setSymbolCategories] = useState<
    Record<string, CategoryLabel>
  >(() => {
    // Try to load from localStorage first
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as Record<string, CategoryLabel>;
      }
    } catch (error) {
      console.error("Error loading categories from localStorage:", error);
    }

    // Fallback to predefined categories
    const initial: Record<string, CategoryLabel> = {};
    chartData.forEach((item) => {
      if (SYMBOL_CATEGORIES[item.symbol]) {
        initial[item.symbol] = SYMBOL_CATEGORIES[item.symbol];
      }
    });
    return initial;
  });

  const [symbolSectors, setSymbolSectors] = useState<
    Record<string, SectorLabel>
  >(() => {
    // Try to load from localStorage first
    try {
      const saved = localStorage.getItem(SECTORS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as Record<string, SectorLabel>;
      }
    } catch (error) {
      console.error("Error loading sectors from localStorage:", error);
    }

    // Fallback to predefined sectors
    const initial: Record<string, SectorLabel> = {};
    chartData.forEach((item) => {
      if (SYMBOL_SECTORS[item.symbol]) {
        initial[item.symbol] = SYMBOL_SECTORS[item.symbol];
      }
    });
    return initial;
  });

  // Get category for a symbol
  const getCategory = (symbol: string): CategoryLabel | undefined => {
    return symbolCategories[symbol];
  };

  // Update category for a symbol
  const updateCategory = (symbol: string, category: CategoryLabel) => {
    setSymbolCategories((prev) => {
      const updated = {
        ...prev,
        [symbol]: category,
      };
      // Save to localStorage
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving categories to localStorage:", error);
      }
      return updated;
    });
  };

  // Get sector for a symbol
  const getSector = (symbol: string): SectorLabel | undefined => {
    return symbolSectors[symbol];
  };

  // Update sector for a symbol
  const updateSector = (symbol: string, sector: SectorLabel) => {
    setSymbolSectors((prev) => {
      const updated = {
        ...prev,
        [symbol]: sector,
      };
      // Save to localStorage
      try {
        localStorage.setItem(SECTORS_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving sectors to localStorage:", error);
      }
      return updated;
    });
  };

  // Calculate category percentages
  const categoryPercentages = chartData.reduce((acc, item) => {
    const category = getCategory(item.symbol);
    if (category) {
      const percentage = parseFloat(item.percentage);
      acc[category] = (acc[category] || 0) + percentage;
    }
    return acc;
  }, {} as Record<CategoryLabel, number>);

  // Calculate sector percentages
  const sectorPercentages = chartData.reduce((acc, item) => {
    const sector = getSector(item.symbol);
    if (sector) {
      const percentage = parseFloat(item.percentage);
      acc[sector] = (acc[sector] || 0) + percentage;
    }
    return acc;
  }, {} as Record<SectorLabel, number>);

  // Function to copy symbol-percentage data to clipboard
  const handleCopyData = async () => {
    const dataText = chartData
      .map(
        (item) =>
          `${item.symbol}\t${getCategory(item.symbol) || "Uncategorized"}\t${
            getSector(item.symbol) || "Uncategorized"
          }\t${item.percentage}%`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(dataText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <p>Set the category and sector for each symbol</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyData}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Data
                </>
              )}
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-2 px-3 font-medium">Symbol</th>
                  <th className="text-left py-2 px-3 font-medium">Category</th>
                  <th className="text-left py-2 px-3 font-medium">Sector</th>
                  <th className="text-right py-2 px-3 font-medium">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => {
                  const category = getCategory(item.symbol);
                  const sector = getSector(item.symbol);
                  return (
                    <tr
                      key={item.symbol}
                      className={
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      }
                    >
                      <td className="py-2 px-3 font-medium">{item.symbol}</td>
                      <td className="py-2 px-3">
                        <Select
                          value={category}
                          onValueChange={(value: string) =>
                            updateCategory(item.symbol, value as CategoryLabel)
                          }
                        >
                          <SelectTrigger
                            className={`h-7 w-[160px] text-xs ${
                              category
                                ? "border-solid"
                                : "border-dashed border-muted-foreground/50"
                            }`}
                          >
                            <SelectValue placeholder="+ Add category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Staple">Staple</SelectItem>
                            <SelectItem value="Mature Growth">
                              Mature Growth
                            </SelectItem>
                            <SelectItem value="High Growth">
                              High Growth
                            </SelectItem>
                            <SelectItem value="High Risk">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-3">
                        <Select
                          value={sector}
                          onValueChange={(value: string) =>
                            updateSector(item.symbol, value as SectorLabel)
                          }
                        >
                          <SelectTrigger
                            className={`h-7 w-[180px] text-xs ${
                              sector
                                ? "border-solid"
                                : "border-dashed border-muted-foreground/50"
                            }`}
                          >
                            <SelectValue placeholder="+ Add sector" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Energy">Energy</SelectItem>
                            <SelectItem value="Materials">Materials</SelectItem>
                            <SelectItem value="Industrials">
                              Industrials
                            </SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="Financials">
                              Financials
                            </SelectItem>
                            <SelectItem value="Consumer Discretionary">
                              Consumer Discretionary
                            </SelectItem>
                            <SelectItem value="Consumer Staples">
                              Consumer Staples
                            </SelectItem>
                            <SelectItem value="Information Technology">
                              Information Technology
                            </SelectItem>
                            <SelectItem value="Communication Services">
                              Communication Services
                            </SelectItem>
                            <SelectItem value="Real Estate">
                              Real Estate
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="text-right py-2 px-3">
                        {item.percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdown categoryPercentages={categoryPercentages} />
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Sector Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SectorBreakdown sectorPercentages={sectorPercentages} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
