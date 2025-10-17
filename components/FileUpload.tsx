"use client";

import { useState, useRef, useEffect } from "react";
import { FileUploadCard } from "./FileUploadCard";
import { PortfolioTable } from "./PortfolioTable";
import { PortfolioPieChart } from "./PortfolioPieChart";
import {
  parseXLSXFile,
  groupPortfolioData,
  type PortfolioRow,
} from "@/lib/xlsxParser";

const STORAGE_KEY = "portfolio-tracker-data";
const STORAGE_FILENAME_KEY = "portfolio-tracker-filename";

export const FileUpload = () => {
  const [fileName, setFileName] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<PortfolioRow[]>([]);
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
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_FILENAME_KEY);
  };

  const groupedData = groupPortfolioData(portfolioData);

  return (
    <div className="w-full max-w-6xl space-y-6">
      <FileUploadCard
        fileName={fileName}
        fileInputRef={fileInputRef}
        onFileChange={handleFileUpload}
        onButtonClick={handleButtonClick}
        onClearData={handleClearData}
      />
      
      {groupedData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioPieChart groupedData={groupedData} />
          <PortfolioTable
            groupedData={groupedData}
            totalPositions={portfolioData.length}
          />
        </div>
      )}
    </div>
  );
};
