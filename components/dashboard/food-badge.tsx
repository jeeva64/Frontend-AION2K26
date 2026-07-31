import type { FoodPreference } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FoodBadgeProps {
  preference?: FoodPreference;
}

export function FoodBadge({ preference }: FoodBadgeProps) {
  const isVeg = preference === "vegetarian";
  return (
    <span
      className={cn(
        "inline-block rounded px-2 py-0.5 text-xs font-semibold",
        isVeg ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
      )}
    >
      {isVeg ? "🥬 Vegetarian" : "🍗 Non-Vegetarian"}
    </span>
  );
}
