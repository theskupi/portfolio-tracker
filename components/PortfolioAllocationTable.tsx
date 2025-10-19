"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check } from "lucide-react";

interface ChartDataItem {
  symbol: string;
  originalSymbol: string;
  percentage: string;
}

interface PortfolioAllocationTableProps {
  chartData: ChartDataItem[];
}

export function PortfolioAllocationTable({
  chartData,
}: PortfolioAllocationTableProps) {
  const [copied, setCopied] = useState(false);

  // Function to copy symbol-percentage data to clipboard
  const handleCopyData = async () => {
    const dataText = chartData
      .map((item) => `${item.symbol}\t${item.percentage}%`)
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
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Portfolio Allocation</h3>
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
              <th className="text-right py-2 px-3 font-medium">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, index) => {
              return (
                <tr
                  key={item.symbol}
                  className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                >
                  <td className="py-2 px-3 font-medium">{item.symbol}</td>
                  <td className="text-right py-2 px-3">{item.percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
