export type CategoryLabel =
  | "Staple"
  | "Mature Growth"
  | "High Growth"
  | "High Risk";

interface CategoryBreakdownProps {
  categoryPercentages: Record<CategoryLabel, number>;
}

export function CategoryBreakdown({
  categoryPercentages,
}: CategoryBreakdownProps) {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          [
            "Staple",
            "Mature Growth",
            "High Growth",
            "High Risk",
          ] as CategoryLabel[]
        ).map((category) => (
          <div key={category} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">{category}</div>
            <div className="text-lg font-semibold">
              {(categoryPercentages[category] || 0).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
