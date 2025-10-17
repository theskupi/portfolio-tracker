"use client";

import { useState, useRef } from "react";
import { FileUploadCard } from "./FileUploadCard";
import { PortfolioTable } from "./PortfolioTable";
import {
  parseXLSXFile,
  groupPortfolioData,
  type PortfolioRow,
} from "@/lib/xlsxParser";

export const FileUpload = () => {
  const [fileName, setFileName] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<PortfolioRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const data = await parseXLSXFile(file);
      setPortfolioData(data);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const groupedData = groupPortfolioData(portfolioData);

  return (
    <div className="w-full max-w-4xl space-y-6">
      <FileUploadCard
        fileName={fileName}
        fileInputRef={fileInputRef}
        onFileChange={handleFileUpload}
        onButtonClick={handleButtonClick}
      />
      <PortfolioTable
        groupedData={groupedData}
        totalPositions={portfolioData.length}
      />
    </div>
  );
};
