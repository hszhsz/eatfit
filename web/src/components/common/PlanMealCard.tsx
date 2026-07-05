import { Clock3 } from "lucide-react";

import { formatNumber, mealLabels } from "@/lib/format";
import type { MealItem } from "@/types/eatfit";

interface PlanMealCardProps {
  meal: MealItem;
}

export function PlanMealCard({ meal }: PlanMealCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {mealLabels[meal.mealType]}
          </div>
          <h3 className="mt-3 text-xl font-medium text-white">
            {meal.recipe.imageEmoji} {meal.recipe.name}
          </h3>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
          {formatNumber(meal.recipe.calories)} kcal
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
        <Clock3 className="h-4 w-4" />
        {meal.recipe.cookMinutes} min prep
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-white/5 px-3 py-3 text-zinc-300">
          <div className="text-zinc-500">Protein</div>
          <div className="mt-1 font-medium text-white">
            {formatNumber(meal.recipe.proteinG, 1)} g
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 px-3 py-3 text-zinc-300">
          <div className="text-zinc-500">Carbs</div>
          <div className="mt-1 font-medium text-white">
            {formatNumber(meal.recipe.carbsG, 1)} g
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 px-3 py-3 text-zinc-300">
          <div className="text-zinc-500">Fat</div>
          <div className="mt-1 font-medium text-white">
            {formatNumber(meal.recipe.fatG, 1)} g
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {meal.recipe.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#8cffb0]/20 bg-[#8cffb0]/10 px-3 py-1 text-xs text-[#c7ffd7]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
