"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onUploadClick: () => void;
}

export function Navigation({ onUploadClick }: NavigationProps) {
  return (
    <nav className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
          </div>
          
          <Button onClick={onUploadClick} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>
    </nav>
  );
}
