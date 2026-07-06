import { Clock3 } from "lucide-react";

import { formatNumber, mealLabels } from "@/lib/format";
import type { MealItem } from "@/types/eatfit";

interface PlanMealCardProps {
  meal: MealItem;
}

export function PlanMealCard({ meal }: PlanMealCardProps) {
  return (
    <article className="rounded-3xl border border-[#F0E6DD] bg-white p-5 shadow-warm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
            {mealLabels[meal.mealType]}
          </div>
          <h3 className="mt-3 text-xl font-medium text-[#1F1611]">
            {meal.recipe.imageEmoji} {meal.recipe.name}
          </h3>
        </div>
        <div className="rounded-full border border-[#F0E6DD] px-3 py-1 text-xs text-[#6B5544]">
          {formatNumber(meal.recipe.calories)} kcal
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-[#6B5544]">
        <Clock3 className="h-4 w-4" />
        {meal.recipe.cookMinutes} min prep
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-[#FFF5EE] px-3 py-3 text-[#6B5544]">
          <div className="text-[#9C8B7A]">Protein</div>
          <div className="mt-1 font-medium text-[#1F1611]">
            {formatNumber(meal.recipe.proteinG, 1)} g
          </div>
        </div>
        <div className="rounded-2xl bg-[#FFF5EE] px-3 py-3 text-[#6B5544]">
          <div className="text-[#9C8B7A]">Carbs</div>
          <div className="mt-1 font-medium text-[#1F1611]">
            {formatNumber(meal.recipe.carbsG, 1)} g
          </div>
        </div>
        <div className="rounded-2xl bg-[#FFF5EE] px-3 py-3 text-[#6B5544]">
          <div className="text-[#9C8B7A]">Fat</div>
          <div className="mt-1 font-medium text-[#1F1611]">
            {formatNumber(meal.recipe.fatG, 1)} g
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {meal.recipe.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#FF6B35]/20 bg-[#FFE5D9] px-3 py-1 text-xs text-[#FF6B35]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
