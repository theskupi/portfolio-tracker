"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useModal } from "@/contexts/ModalContext";

export function NavControls() {
  const { setIsModalOpen } = useModal();

  return (
    <>
      <ThemeToggle />
      <Button onClick={() => setIsModalOpen(true)} className="gap-2">
        <Upload className="h-4 w-4" />
        Upload File
      </Button>
    </>
  );
}
