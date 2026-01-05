"use client";

import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

interface NavigationProps {
  children?: ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  const { setIsModalOpen } = useModal();

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  return (
    <nav className="border-b border-white/15 bg-white dark:bg-card/40 dark:backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
          </div>

          <div className="flex items-center gap-2">
            {children}
            <Button onClick={handleUploadClick} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
