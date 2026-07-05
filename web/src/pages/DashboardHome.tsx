import { Link } from "react-router-dom";

import { EmptyState } from "@/components/common/EmptyState";
import { MetricCard } from "@/components/common/MetricCard";
import { PlanMealCard } from "@/components/common/PlanMealCard";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useCoachSessions, usePlan } from "@/hooks/useDashboardData";
import { formatDateLabel, formatNumber } from "@/lib/format";
import { useDashboardStore } from "@/store/dashboardStore";

export function DashboardHome() {
  const { data: profile } = useCurrentProfile();
  const selectedDate = useDashboardStore((state) => state.selectedDate);
  const { data: plan, isLoading } = usePlan(profile, selectedDate);
  const { data: sessions } = useCoachSessions(profile);

  if (!profile) {
    return (
      <EmptyState
        title="Your dashboard is ready. Your profile is not."
        body="Complete the nutrition profile first so EatFit can calculate targets, generate meals, and anchor the AI coach in real context."
        cta="Set Up Profile"
        to="/app/profile"
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(140,255,176,0.12),_transparent_28%),rgba(255,255,255,0.04)] p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Dashboard Overview</div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-5xl text-white">
              Welcome back, {profile.name}.
            </h1>
            <p className="mt-3 text-lg text-zinc-400">
              Reviewing {formatDateLabel(selectedDate)} with your current goal locked to {profile.goal.replace("_", " ")}.
            </p>
          </div>
          <Link
            to="/app/coach"
            className="rounded-full bg-[#8cffb0] px-5 py-3 text-sm font-semibold text-[#04120a]"
          >
            Open AI Coach
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Target Calories"
          value={plan ? `${formatNumber(plan.target.targetCalories)} kcal` : "--"}
          meta="Generated from your latest profile"
        />
        <MetricCard
          label="Protein"
          value={plan ? `${formatNumber(plan.target.proteinG, 1)} g` : "--"}
          meta="Daily target"
        />
        <MetricCard
          label="Planned Meals"
          value={plan ? `${plan.meals.length}` : "--"}
          meta="Breakfast to snack coverage"
        />
        <MetricCard
          label="Coach Sessions"
          value={`${sessions?.length || 0}`}
          meta="Saved to Supabase"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <SectionCard title="Today’s meal lineup" eyebrow="Plan">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-52 animate-pulse rounded-3xl bg-white/5"
                />
              ))}
            </div>
          ) : plan ? (
            <div className="grid gap-4 md:grid-cols-2">
              {plan.meals.map((meal) => (
                <PlanMealCard key={`${meal.mealType}-${meal.recipe.id}`} meal={meal} />
              ))}
            </div>
          ) : (
            <div className="text-zinc-400">No plan generated yet.</div>
          )}
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Execution summary" eyebrow="Targets">
            {plan ? (
              <div className="space-y-4">
                {[
                  ["Calories", plan.totalCalories, plan.target.targetCalories, "kcal"],
                  ["Protein", plan.totalProteinG, plan.target.proteinG, "g"],
                  ["Carbs", plan.totalCarbsG, plan.target.carbsG, "g"],
                  ["Fat", plan.totalFatG, plan.target.fatG, "g"],
                ].map(([label, current, target, unit]) => {
                  const ratio = Math.min(Number(current) / Number(target), 1.3);
                  return (
                    <div key={String(label)}>
                      <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
                        <span>{label}</span>
                        <span>
                          {formatNumber(Number(current), 1)} / {formatNumber(Number(target), 1)} {unit}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-[#8cffb0]"
                          style={{ width: `${ratio * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-zinc-400">Save your profile to unlock calculations.</div>
            )}
          </SectionCard>

          <SectionCard title="Latest coaching momentum" eyebrow="AI Coach">
            {sessions && sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="text-sm font-medium text-white">{session.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {session.focus.replace("_", " ")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-400">
                No coach history yet. Open the coach workspace and start the first session.
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
