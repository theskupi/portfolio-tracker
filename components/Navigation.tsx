import { AuthButton } from "@/components/auth/auth-button";
import { ReactNode } from "react";

interface NavigationProps {
  children?: ReactNode;
}

export async function Navigation({ children }: NavigationProps) {
  return (
    <nav className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
          </div>

          <div className="flex items-center gap-2">
            {children}
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
