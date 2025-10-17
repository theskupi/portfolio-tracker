"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";

interface FileUploadCardProps {
  fileName: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
}

export function FileUploadCard({
  fileName,
  fileInputRef,
  onFileChange,
  onButtonClick,
}: FileUploadCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Portfolio File</CardTitle>
        <CardDescription>
          Upload your portfolio XLSX file to view and track your investments
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700">
                Selected file: {fileName}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
