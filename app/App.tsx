"use client";

import { useState, useRef, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { UploadModal } from "../components/UploadModal";
import { FileUploadContent } from "../components/FileUploadContent";
import { PortfolioDataTable } from "../components/PortfolioDataTable";
import { PortfolioChart } from "../components/PortfolioChart";
import {
  parseXLSXFile,
  groupPortfolioData,
  type PortfolioRow,
} from "@/lib/xlsxParser";
import { fetchMultipleStockQuotes } from "@/lib/stockApi";
import { fetchMultipleBrandInfo } from "@/lib/brandfetchApi";
import { GroupedPortfolio } from "@/types/portfolio";
import { PortfolioAllocationTable } from "@/components/PortfolioAllocationTable";
import { getBrandColor } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STORAGE_KEY = "portfolio-tracker-data";
const STORAGE_FILENAME_KEY = "portfolio-tracker-filename";

export const App = () => {
  const [fileName, setFileName] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<PortfolioRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [enrichedData, setEnrichedData] = useState<GroupedPortfolio[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedFileName = localStorage.getItem(STORAGE_FILENAME_KEY);

      if (savedData) {
        const parsedData = JSON.parse(savedData) as PortfolioRow[];
        setPortfolioData(parsedData);
      }

      if (savedFileName) {
        setFileName(savedFileName);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const data = await parseXLSXFile(file);
      setPortfolioData(data);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_FILENAME_KEY, file.name);

      // Close modal after successful upload
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearData = () => {
    setPortfolioData([]);
    setFileName("");
    setEnrichedData([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_FILENAME_KEY);
  };

  const handleAddPosition = (position: {
    symbol: string;
    volume: string;
    openPrice: string;
  }) => {
    // Create a new PortfolioRow from the manual position
    const newPosition: PortfolioRow = {
      symbol: position.symbol,
      volume: position.volume,
      openPrice: position.openPrice,
    };

    // Add to existing portfolio data
    const updatedData = [...portfolioData, newPosition];
    setPortfolioData(updatedData);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };

  const handleDeleteSymbol = (symbol: string) => {
    // Remove all positions for the given symbol
    const updatedData = portfolioData.filter(
      (position) => position.symbol !== symbol
    );
    setPortfolioData(updatedData);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };

  // Fetch brand information for all symbols
  const fetchBrandData = async (grouped: GroupedPortfolio[]) => {
    setIsLoadingBrands(true);
    const symbols = grouped.map((item) => item.symbol);

    try {
      const brandInfo = await fetchMultipleBrandInfo(symbols);

      // Enrich grouped data with brand info
      const enriched = grouped.map((item) => {
        const brand = brandInfo.get(item.symbol);
        if (brand) {
          return {
            ...item,
            brandInfo: brand,
          };
        }
        return item;
      });

      return enriched;
    } catch (error) {
      console.error("Error fetching brand info:", error);
      return grouped;
    } finally {
      setIsLoadingBrands(false);
    }
  };

  // Fetch real-time stock quotes and enrich data
  const fetchAndEnrichData = async (data: PortfolioRow[]) => {
    if (data.length === 0) {
      setEnrichedData([]);
      return;
    }

    setIsLoadingQuotes(true);
    const grouped = groupPortfolioData(data);

    // Extract unique symbols
    const symbols = grouped.map((item) => item.symbol);

    try {
      // Fetch stock quotes and brand info in parallel
      const [stockQuotes, groupedWithBrands] = await Promise.all([
        fetchMultipleStockQuotes(symbols),
        fetchBrandData(grouped),
      ]);

      // Enrich grouped data with current prices
      const enriched = groupedWithBrands.map((item) => {
        const quote = stockQuotes.get(item.symbol);

        if (quote) {
          const currentValue = item.totalVolume * quote.currentPrice;
          const profitLoss = currentValue - item.totalValue;
          const profitLossPercent = (profitLoss / item.totalValue) * 100;

          return {
            ...item,
            currentPrice: quote.currentPrice,
            currentValue,
            profitLoss,
            profitLossPercent,
          };
        }

        return item;
      });

      setEnrichedData(enriched);
    } catch (error) {
      console.error("Error fetching stock quotes:", error);
      setEnrichedData(grouped);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  // Fetch quotes when portfolio data changes
  useEffect(() => {
    fetchAndEnrichData(portfolioData);
  }, [portfolioData]);

  const groupedData =
    enrichedData.length > 0 ? enrichedData : groupPortfolioData(portfolioData);

  const totalPortfolioValue = groupedData.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );

  const chartData = groupedData
    .map((item, index) => {
      const currentValue = item.currentValue || item.totalValue;
      // Use brand color if available, otherwise fall back to palette
      const brandColor = getBrandColor(
        item.brandInfo?.colors,
        index,
        item.symbol
      );

      return {
        symbol: item.symbol,
        originalSymbol: item.symbol,
        value: item.totalValue,
        currentValue: currentValue,
        volume: item.totalVolume,
        percentage: ((item.totalValue / totalPortfolioValue) * 100).toFixed(1),
        fill: brandColor,
        brandInfo: item.brandInfo,
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation onUploadClick={() => setIsModalOpen(true)} />

      <UploadModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FileUploadContent
          fileName={fileName}
          fileInputRef={fileInputRef}
          onFileChange={handleFileUpload}
          onButtonClick={handleButtonClick}
          onClearData={handleClearData}
        />
      </UploadModal>

      <main className="container mx-auto px-4 py-8">
        {groupedData.length > 0 ? (
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="allocations">Allocations</TabsTrigger>
                <TabsTrigger value="dividends">Dividends</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <PortfolioChart
                  groupedData={groupedData}
                  chartData={chartData}
                  totalPortfolioValue={totalPortfolioValue}
                />
                <PortfolioDataTable
                  groupedData={groupedData}
                  totalPositions={portfolioData.length}
                  isLoadingQuotes={isLoadingQuotes || isLoadingBrands}
                  handleAddPosition={handleAddPosition}
                  onDeleteSymbol={handleDeleteSymbol}
                />
              </div>
            </TabsContent>

            <TabsContent value="allocations">
              <PortfolioAllocationTable chartData={chartData} />
            </TabsContent>

            <TabsContent value="dividends">
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500 text-lg mb-4">
                  Dividends tracking coming soon
                </p>
                <p className="text-gray-400 text-sm">
                  This feature is under development
                </p>
              </div>
            </TabsContent>

            <TabsContent value="earnings">
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500 text-lg mb-4">
                  Earnings tracking coming soon
                </p>
                <p className="text-gray-400 text-sm">
                  This feature is under development
                </p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              No portfolio data loaded
            </p>
            <p className="text-gray-400 text-sm">
              Click "Upload File" to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
