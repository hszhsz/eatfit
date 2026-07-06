import { Link } from "react-router-dom";

import { EmptyState } from "@/components/common/EmptyState";
import { MetricCard } from "@/components/common/MetricCard";
import { OnboardingSteps } from "@/components/common/OnboardingSteps";
import { PlanMealCard } from "@/components/common/PlanMealCard";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useCoachSessions, usePlan } from "@/hooks/useDashboardData";
import { formatDateLabel, formatNumber, getGoalLabels } from "@/lib/format";
import { useDashboardStore } from "@/store/dashboardStore";
import { useLang } from "@/i18n/LanguageContext";

export function DashboardHome() {
  const { data: profile } = useCurrentProfile();
  const selectedDate = useDashboardStore((state) => state.selectedDate);
  const { data: plan, isLoading } = usePlan(profile, selectedDate);
  const { data: sessions } = useCoachSessions(profile);
  const { lang, t } = useLang();

  if (!profile) {
    return (
      <EmptyState
        title={t("empty.profile.title")}
        body={t("empty.profile.body")}
        cta={t("empty.profile.cta")}
        to="/app/profile"
      />
    );
  }

  const goalLabels = getGoalLabels(lang);
  const hasPlan = Boolean(plan?.meals?.length);
  const hasCoach = Boolean(sessions?.length);

  return (
    <div className="space-y-6">
      <OnboardingSteps hasProfile hasPlan={hasPlan} hasCoach={hasCoach} />

      <section className="rounded-[24px] border border-[#F0E6DD] bg-[radial-gradient(circle_at_top_left,_rgba(255,107,53,0.08),_transparent_28%),rgba(255,255,255,0.6)] p-6 shadow-warm">
        <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{t("dash.overview")}</div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl text-[#1F1611] md:text-5xl">
              {t("dash.welcome", { name: profile.name })}
            </h1>
            <p className="mt-3 text-lg text-[#6B5544]">
              {t("dash.reviewing", {
                date: formatDateLabel(selectedDate, lang),
                goal: goalLabels[profile.goal],
              })}
            </p>
          </div>
          <Link
            to="/app/coach"
            className="rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E55329]"
          >
            {t("dash.openCoach")}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t("dash.targetCalories")}
          value={plan ? `${formatNumber(plan.target.targetCalories, 0, lang)} kcal` : "--"}
          meta={t("dash.metaGenerated")}
        />
        <MetricCard
          label={t("dash.protein")}
          value={plan ? `${formatNumber(plan.target.proteinG, 1, lang)} g` : "--"}
          meta={t("dash.metaDailyTarget")}
        />
        <MetricCard
          label={t("dash.plannedMeals")}
          value={plan ? `${plan.meals.length}` : "--"}
          meta={t("dash.metaBreakfast")}
        />
        <MetricCard
          label={t("dash.coachSessions")}
          value={`${sessions?.length || 0}`}
          meta={t("dash.metaSupabase")}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <SectionCard title={t("dash.todayLineup")} eyebrow={t("plan.eyebrow")}>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-52 animate-pulse rounded-3xl bg-[#FFF5EE]"
                />
              ))}
            </div>
          ) : plan && plan.meals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {plan.meals.map((meal) => (
                <PlanMealCard key={`${meal.mealType}-${meal.recipe.id}`} meal={meal} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-[#6B5544]">
              <p>{t("dash.noPlanYet")}</p>
              <Link
                to="/app/plan"
                className="rounded-full bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E55329]"
              >
                {lang === "zh" ? "生成计划" : "Generate Plan"}
              </Link>
            </div>
          )}
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title={t("dash.executionSummary")} eyebrow={t("dash.metaDailyTarget")}>
            {plan ? (
              <div className="space-y-4">
                {[
                  [t("plan.calories"), plan.totalCalories, plan.target.targetCalories, "kcal"],
                  [t("dash.protein"), plan.totalProteinG, plan.target.proteinG, "g"],
                  [t("plan.carbs"), plan.totalCarbsG, plan.target.carbsG, "g"],
                  [t("plan.fat"), plan.totalFatG, plan.target.fatG, "g"],
                ].map(([label, current, target, unit]) => {
                  const ratio = Math.min(Number(current) / Number(target), 1.3);
                  return (
                    <div key={String(label)}>
                      <div className="mb-2 flex items-center justify-between text-sm text-[#6B5544]">
                        <span>{label}</span>
                        <span>
                          {formatNumber(Number(current), 1, lang)} / {formatNumber(Number(target), 1, lang)} {unit}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#FFF5EE]">
                        <div
                          className="h-full rounded-full bg-[#FF6B35]"
                          style={{ width: `${ratio * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-[#6B5544]">{t("dash.saveProfile")}</div>
            )}
          </SectionCard>

          <SectionCard title={t("dash.latestMomentum")} eyebrow={t("shell.nav.coach")}>
            {sessions && sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-[#F0E6DD] bg-[#FFF5EE] p-4"
                  >
                    <div className="text-sm font-medium text-[#1F1611]">{session.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#9C8B7A]">
                      {session.focus.replace("_", " ")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#6B5544]">
                {t("dash.noCoachHistory")}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
