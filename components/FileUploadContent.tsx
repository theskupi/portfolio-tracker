"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadContentProps {
  fileName: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  onClearData?: () => void;
}

export function FileUploadContent({
  fileName,
  fileInputRef,
  onFileChange,
  onButtonClick,
  onClearData,
}: FileUploadContentProps) {
  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onClick={onButtonClick}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <Button type="button" variant="outline">
            Choose XLSX File
          </Button>
          <p className="text-sm text-gray-500">
            Click to select your XLSX file
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {fileName && (
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            Selected file: {fileName}
          </p>
          {onClearData && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearData}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Data
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
