import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PlanMealCard } from "@/components/common/PlanMealCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { usePlan } from "@/hooks/useDashboardData";
import { formatDateLabel, formatNumber } from "@/lib/format";
import { useDashboardStore } from "@/store/dashboardStore";

export function PlanPage() {
  const { data: profile } = useCurrentProfile();
  const selectedDate = useDashboardStore((state) => state.selectedDate);
  const setSelectedDate = useDashboardStore((state) => state.setSelectedDate);
  const { data: plan, isLoading, error } = usePlan(profile, selectedDate);

  if (!profile) {
    return (
      <EmptyState
        title="No plan without a profile"
        body="Save your profile first so the planner has real inputs for calories, macro targets, allergens, and preferences."
        cta="Go to Profile"
        to="/app/profile"
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Daily meal plan"
        eyebrow="Planner"
        action={
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-sm text-[#1F1611] outline-none"
          />
        }
      >
        <div className="mb-6 text-[#6B5544]">
          Viewing {formatDateLabel(selectedDate)}. Every request uses your latest Supabase profile data and the backend meal planner.
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-60 animate-pulse rounded-3xl bg-[#FFF5EE]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{String(error.message)}</div>
        ) : plan ? (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              {[
                ["Calories", `${formatNumber(plan.totalCalories)} kcal`],
                ["Protein", `${formatNumber(plan.totalProteinG, 1)} g`],
                ["Carbs", `${formatNumber(plan.totalCarbsG, 1)} g`],
                ["Fat", `${formatNumber(plan.totalFatG, 1)} g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-[#F0E6DD] bg-white p-5 shadow-warm">
                  <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{label}</div>
                  <div className="mt-3 text-2xl font-medium text-[#1F1611]">{value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {plan.meals.map((meal) => (
                <PlanMealCard key={`${meal.mealType}-${meal.recipe.id}`} meal={meal} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-[#6B5544]">No data returned for this date.</div>
        )}
      </SectionCard>
    </div>
  );
}
