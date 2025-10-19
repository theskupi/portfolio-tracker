"use client";

import { useState, useRef, useEffect } from "react";
import { Navigation } from "./Navigation";
import { UploadModal } from "./UploadModal";
import { FileUploadContent } from "./FileUploadContent";
import { PortfolioDataTable } from "./PortfolioDataTable";
import { PortfolioPieChart } from "./PortfolioPieChart";
import {
  parseXLSXFile,
  groupPortfolioData,
  type PortfolioRow,
} from "@/lib/xlsxParser";
import { fetchMultipleStockQuotes } from "@/lib/stockApi";
import { GroupedPortfolio } from "@/types/portfolio";

const STORAGE_KEY = "portfolio-tracker-data";
const STORAGE_FILENAME_KEY = "portfolio-tracker-filename";

export const FileUpload = () => {
  const [fileName, setFileName] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<PortfolioRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
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
      const stockQuotes = await fetchMultipleStockQuotes(symbols);

      // Enrich grouped data with current prices
      const enriched = grouped.map((item) => {
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PortfolioPieChart groupedData={groupedData} />
            <PortfolioDataTable
              groupedData={groupedData}
              totalPositions={portfolioData.length}
              isLoadingQuotes={isLoadingQuotes}
            />
          </div>
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
