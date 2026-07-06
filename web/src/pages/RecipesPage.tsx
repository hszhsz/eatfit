import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useRecipes } from "@/hooks/useDashboardData";
import { formatNumber } from "@/lib/format";
import { useLang } from "@/i18n/LanguageContext";

export function RecipesPage() {
  const { data: recipes, isLoading, error } = useRecipes();
  const [mealFilter, setMealFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { lang, t } = useLang();

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
      <SectionCard title={t("recipes.title")} eyebrow={t("recipes.eyebrow")}>
        <div className="mb-6 grid gap-4 md:grid-cols-[220px_1fr]">
          <select
            value={mealFilter}
            onChange={(event) => setMealFilter(event.target.value)}
            className="rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none"
          >
            <option value="all">{t("recipes.allMeals")}</option>
            <option value="breakfast">{t("recipes.breakfast")}</option>
            <option value="lunch">{t("recipes.lunch")}</option>
            <option value="dinner">{t("recipes.dinner")}</option>
            <option value="snack">{t("recipes.snack")}</option>
          </select>
          <input
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            placeholder={t("recipes.filterPlaceholder")}
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
            title={t("recipes.empty.title")}
            body={t("recipes.empty.body")}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((recipe) => {
              const isExpanded = expandedId === recipe.id;
              const visibleSteps = isExpanded ? recipe.steps : recipe.steps.slice(0, 3);
              return (
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
                      {t("recipes.cookTime", { min: recipe.cookMinutes })}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-[#6B5544]">
                    <div>
                      <div className="text-[#9C8B7A]">{t("recipes.calories")}</div>
                      <div className="mt-1 text-[#1F1611]">{formatNumber(recipe.calories, 0, lang)}</div>
                    </div>
                    <div>
                      <div className="text-[#9C8B7A]">{t("recipes.protein")}</div>
                      <div className="mt-1 text-[#1F1611]">{formatNumber(recipe.proteinG, 1, lang)} g</div>
                    </div>
                    <div>
                      <div className="text-[#9C8B7A]">{t("recipes.carbs")}</div>
                      <div className="mt-1 text-[#1F1611]">{formatNumber(recipe.carbsG, 1, lang)} g</div>
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
                    {visibleSteps.map((step, index) => (
                      <li key={`${recipe.id}-${index}`}>{index + 1}. {step}</li>
                    ))}
                  </ol>

                  {recipe.steps.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                      className="mt-3 text-sm font-medium text-[#FF6B35] transition hover:text-[#E55329]"
                    >
                      {isExpanded
                        ? (lang === "zh" ? "收起步骤" : "Show less")
                        : (lang === "zh" ? `查看全部 ${recipe.steps.length} 步` : `Show all ${recipe.steps.length} steps`)}
                    </button>
                  )}

                  {isExpanded && recipe.ingredients.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-[#FFF5EE] p-4">
                      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-[#9C8B7A]">
                        {lang === "zh" ? "食材清单" : "Ingredients"}
                      </div>
                      <div className="space-y-1 text-sm text-[#6B5544]">
                        {recipe.ingredients.map((ing) => (
                          <div key={ing.name} className="flex justify-between">
                            <span>{ing.name}</span>
                            <span>{formatNumber(ing.amountG, 0, lang)} g</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
