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

interface GroupedPortfolio {
  symbol: string;
  totalVolume: number;
  positions: Array<{
    symbol: string;
    volume: string;
    openPrice: string;
  }>;
  averageOpenPrice: number;
}

interface PortfolioTableProps {
  groupedData: GroupedPortfolio[];
  totalPositions: number;
}

export function PortfolioTable({ groupedData, totalPositions }: PortfolioTableProps) {
  if (groupedData.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Data</CardTitle>
        <CardDescription>
          Showing {groupedData.length} unique{" "}
          {groupedData.length === 1 ? "symbol" : "symbols"} ({totalPositions} total positions)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Total Volume</TableHead>
                <TableHead>Avg. Open Price</TableHead>
                <TableHead className="text-right">Positions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedData.map((group, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {group.symbol}
                  </TableCell>
                  <TableCell>{group.totalVolume.toFixed(4)}</TableCell>
                  <TableCell>${group.averageOpenPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{group.positions.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
