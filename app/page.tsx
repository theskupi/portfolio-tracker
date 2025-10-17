import { FileUpload } from "@/components/FileUpload";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Portfolio Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your CSV file to start tracking your investments
            </p>
          </div>

          <FileUpload />
        </div>
      </main>
    </div>
  );
}
