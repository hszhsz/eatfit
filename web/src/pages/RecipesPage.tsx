import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useRecipes } from "@/hooks/useDashboardData";
import { formatNumber } from "@/lib/format";

export function RecipesPage() {
  const { data: recipes, isLoading, error } = useRecipes();
  const [mealFilter, setMealFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");

  const filtered = useMemo(() => {
    return (recipes || []).filter((recipe) => {
      if (mealFilter !== "all" && recipe.mealType !== mealFilter) {
        return false;
      }
      if (tagFilter && !recipe.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [mealFilter, recipes, tagFilter]);

  return (
    <div className="space-y-6">
      <SectionCard title="Recipe library" eyebrow="Catalog">
        <div className="mb-6 grid gap-4 md:grid-cols-[220px_1fr]">
          <select
            value={mealFilter}
            onChange={(event) => setMealFilter(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          >
            <option value="all">All meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <input
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            placeholder="Filter by tag"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="text-rose-300">{String(error.message)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No recipes match the current filters"
            body="Adjust the meal type or tag filter to reveal the seeded recipe library."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((recipe) => (
              <article
                key={recipe.id}
                className="rounded-[28px] border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                      {recipe.mealType}
                    </div>
                    <h3 className="mt-3 text-2xl font-medium text-white">
                      {recipe.imageEmoji} {recipe.name}
                    </h3>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                    {recipe.cookMinutes} min
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-zinc-300">
                  <div>
                    <div className="text-zinc-500">Calories</div>
                    <div className="mt-1 text-white">{formatNumber(recipe.calories)}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500">Protein</div>
                    <div className="mt-1 text-white">{formatNumber(recipe.proteinG, 1)} g</div>
                  </div>
                  <div>
                    <div className="text-zinc-500">Carbs</div>
                    <div className="mt-1 text-white">{formatNumber(recipe.carbsG, 1)} g</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#8cffb0]/20 bg-[#8cffb0]/10 px-3 py-1 text-xs text-[#c7ffd7]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ol className="mt-5 space-y-2 text-sm leading-6 text-zinc-400">
                  {recipe.steps.slice(0, 3).map((step, index) => (
                    <li key={`${recipe.id}-${index}`}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
