"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { GroupedPortfolio } from "@/types/portfolio";
import { AddPositionModal, AddPositionModalProps } from "./AddPositionModal";

interface PortfolioDataTableProps {
  groupedData: GroupedPortfolio[];
  totalPositions: number;
  isLoadingQuotes?: boolean;
  handleAddPosition: AddPositionModalProps["onAddPosition"];
  onDeleteSymbol: (symbol: string) => void;
}

export function PortfolioDataTable({
  groupedData,
  totalPositions,
  isLoadingQuotes = false,
  handleAddPosition,
  onDeleteSymbol,
}: PortfolioDataTableProps) {
  if (groupedData.length === 0) return null;

  // Calculate total portfolio value
  const totalPortfolioValue = groupedData.reduce(
    (sum, group) => sum + group.totalValue,
    0
  );
  const totalCurrentValue = groupedData.reduce(
    (sum, group) => sum + (group.currentValue || group.totalValue),
    0
  );
  const totalProfitLoss = totalCurrentValue - totalPortfolioValue;

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Portfolio Data</CardTitle>
        <CardDescription>
          <div className="flex justify-between items-end">
            <p>
              Showing {groupedData.length} unique{" "}
              {groupedData.length === 1 ? "symbol" : "symbols"} (
              {totalPositions} total positions)
            </p>
            <AddPositionModal onAddPosition={handleAddPosition} />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Avg. Open</TableHead>
                <TableHead>Current</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">P/L</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedData.map((group, index) => {
                const profitLossColor = group.profitLoss
                  ? group.profitLoss >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  : "";

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {group.symbol}
                    </TableCell>
                    <TableCell>{group.totalVolume}</TableCell>
                    <TableCell>${group.averageOpenPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {isLoadingQuotes ? (
                        <Skeleton className="h-4 w-16" />
                      ) : group.currentPrice ? (
                        `$${group.currentPrice.toFixed(2)}`
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ${group.totalValue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {isLoadingQuotes && !group.currentValue ? (
                        <Skeleton className="h-4 w-20 ml-auto" />
                      ) : (
                        `$${(group.currentValue || group.totalValue).toFixed(
                          2
                        )}`
                      )}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${profitLossColor}`}
                    >
                      {isLoadingQuotes && group.profitLoss === undefined ? (
                        <Skeleton className="h-4 w-24 ml-auto" />
                      ) : group.profitLoss !== undefined ? (
                        <>
                          {group.profitLoss >= 0 ? "+" : ""}$
                          {group.profitLoss.toFixed(2)}
                          <span className="text-xs ml-1">
                            ({group.profitLossPercent?.toFixed(2)}%)
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteSymbol(group.symbol)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>Total Portfolio</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-right">
                  ${totalPortfolioValue.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${totalCurrentValue.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalProfitLoss >= 0 ? "+" : "-"}${totalProfitLoss.toFixed(2)}
                  <span className="text-xs ml-1">
                    (
                    {((totalProfitLoss / totalPortfolioValue) * 100).toFixed(2)}
                    %)
                  </span>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
