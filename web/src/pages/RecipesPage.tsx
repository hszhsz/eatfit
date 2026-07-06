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
            className="rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none"
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
            className="rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-3xl bg-[#FFF5EE]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{String(error.message)}</div>
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
                className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
                      {recipe.mealType}
                    </div>
                    <h3 className="mt-3 text-2xl font-medium text-[#1F1611]">
                      {recipe.imageEmoji} {recipe.name}
                    </h3>
                  </div>
                  <div className="rounded-full border border-[#F0E6DD] px-3 py-1 text-xs text-[#6B5544]">
                    {recipe.cookMinutes} min
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-[#6B5544]">
                  <div>
                    <div className="text-[#9C8B7A]">Calories</div>
                    <div className="mt-1 text-[#1F1611]">{formatNumber(recipe.calories)}</div>
                  </div>
                  <div>
                    <div className="text-[#9C8B7A]">Protein</div>
                    <div className="mt-1 text-[#1F1611]">{formatNumber(recipe.proteinG, 1)} g</div>
                  </div>
                  <div>
                    <div className="text-[#9C8B7A]">Carbs</div>
                    <div className="mt-1 text-[#1F1611]">{formatNumber(recipe.carbsG, 1)} g</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#FF6B35]/20 bg-[#FFE5D9] px-3 py-1 text-xs text-[#FF6B35]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ol className="mt-5 space-y-2 text-sm leading-6 text-[#6B5544]">
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
