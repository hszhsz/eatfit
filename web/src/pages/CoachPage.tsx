import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import {
  useCoachMessages,
  useCoachMutation,
  useCoachSessions,
} from "@/hooks/useDashboardData";
import { useDashboardStore } from "@/store/dashboardStore";
import type { CoachFocus } from "@/types/eatfit";

const focusOptions: { value: CoachFocus; label: string }[] = [
  { value: "daily_review", label: "Daily Review" },
  { value: "meal_strategy", label: "Meal Strategy" },
  { value: "eating_out", label: "Eating Out" },
  { value: "cravings", label: "Cravings" },
];

export function CoachPage() {
  const { data: profile } = useCurrentProfile();
  const selectedDate = useDashboardStore((state) => state.selectedDate);
  const coachFocus = useDashboardStore((state) => state.coachFocus);
  const setCoachFocus = useDashboardStore((state) => state.setCoachFocus);
  const [message, setMessage] = useState("");
  const { data: sessions } = useCoachSessions(profile);
  const currentSessionId = sessions?.[0]?.id;
  const { data: messages } = useCoachMessages(currentSessionId);
  const coachMutation = useCoachMutation(profile, selectedDate);

  const latestResponse = useMemo(() => {
    if (coachMutation.data?.response) {
      return coachMutation.data.response;
    }
    if (!messages?.length) {
      return null;
    }
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const candidate = messages[index];
      if (candidate.structuredPayload) {
        return candidate.structuredPayload;
      }
    }
    return null;
  }, [coachMutation.data, messages]);

  useEffect(() => {
    if (!message && coachFocus === "daily_review") {
      setMessage("Review today and tell me what to tighten for tomorrow.");
    }
  }, [coachFocus, message]);

  if (!profile) {
    return (
      <EmptyState
        title="The coach needs your profile context"
        body="Save a profile first so the AI advice can anchor to your calories, macros, goal, allergens, and meal plan."
        cta="Go to Profile"
        to="/app/profile"
      />
    );
  }

  async function handleSubmit() {
    await coachMutation.mutateAsync({
      focus: coachFocus,
      message,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <SectionCard title="Coach control" eyebrow="Input">
        <div className="space-y-3">
          {focusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCoachFocus(option.value)}
              className={[
                "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                coachFocus === option.value
                  ? "border-[#8cffb0]/40 bg-[#8cffb0]/10 text-white"
                  : "border-white/10 bg-black/20 text-zinc-300 hover:bg-white/5",
              ].join(" ")}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="mt-6 block">
          <div className="mb-2 text-sm text-zinc-300">Context</div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={8}
            className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none"
          />
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={coachMutation.isPending}
          className="mt-6 w-full rounded-full bg-[#8cffb0] px-5 py-3 text-sm font-semibold text-[#04120a] disabled:opacity-60"
        >
          {coachMutation.isPending ? "Generating advice..." : "Generate Advice"}
        </button>
      </SectionCard>

      <div className="space-y-6">
        <SectionCard title="Structured response" eyebrow="Output">
          {latestResponse ? (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Headline</div>
                <h2 className="mt-3 font-serif text-3xl text-white">{latestResponse.headline}</h2>
                <p className="mt-4 leading-7 text-zinc-400">{latestResponse.summary}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Score</div>
                  <div className="mt-3 text-5xl font-semibold text-white">{latestResponse.score}</div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Disclaimer</div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{latestResponse.disclaimer}</p>
                </div>
              </div>

              {[
                ["Risk alerts", latestResponse.riskAlerts],
                ["Nutrition insights", latestResponse.nutritionInsights],
                ["Next actions", latestResponse.nextActions],
                ["Meal strategy", latestResponse.mealStrategy],
              ].map(([label, items]) => (
                <div
                  key={String(label)}
                  className="rounded-[28px] border border-white/10 bg-black/20 p-5"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{label}</div>
                  <ul className="mt-4 space-y-3 text-zinc-300">
                    {(items as string[]).map((item, index) => (
                      <li key={`${label}-${index}`} className="rounded-2xl bg-white/5 px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-400">
              Run a coaching prompt to generate the first structured response.
            </div>
          )}
        </SectionCard>

        <SectionCard title="Saved sessions" eyebrow="Supabase history">
          {sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                >
                  <div className="font-medium text-white">{session.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {session.focus.replace("_", " ")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-400">No saved sessions yet.</div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
