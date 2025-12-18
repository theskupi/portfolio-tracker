import { AuthButton } from "@/components/auth/auth-button";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

interface NavigationProps {
  children?: ReactNode;
}

export async function Navigation({ children }: NavigationProps) {
  return (
    <nav className="border-b border-white/15 bg-white dark:bg-card/40 dark:backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
          </div>

          <div className="flex items-center gap-2">
            {children}
            <Button onClick={onUploadClick} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
