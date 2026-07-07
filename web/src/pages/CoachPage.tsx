import { useEffect, useMemo, useRef, useState } from "react";

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
import { useLang } from "@/i18n/LanguageContext";

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
  const { t } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);

  const focusOptions: { value: CoachFocus; label: string }[] = [
    { value: "daily_review", label: t("coach.focus.dailyReview") },
    { value: "meal_strategy", label: t("coach.focus.mealStrategy") },
    { value: "eating_out", label: t("coach.focus.eatingOut") },
    { value: "cravings", label: t("coach.focus.cravings") },
  ];

  // Build conversation context from history
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
      setMessage(t("coach.contextPlaceholder"));
    }
  }, [coachFocus, message, t]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, coachMutation.data]);

  if (!profile) {
    return (
      <EmptyState
        title={t("coach.empty.title")}
        body={t("coach.empty.body")}
        cta={t("coach.empty.cta")}
        to="/app/profile"
      />
    );
  }

  async function handleSubmit() {
    await coachMutation.mutateAsync({
      focus: coachFocus,
      message,
    });
    setMessage("");
  }

  async function handleQuickReply(reply: string) {
    setMessage(reply);
    await coachMutation.mutateAsync({
      focus: coachFocus,
      message: reply,
    });
    setMessage("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
      {/* Left panel: focus + input */}
      <div className="space-y-4">
        <SectionCard title={t("coach.title")} eyebrow={t("coach.eyebrow")}>
          <div className="space-y-2">
            {focusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCoachFocus(option.value)}
                className={[
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                  coachFocus === option.value
                    ? "border-[#FF6B35]/40 bg-[#FFE5D9] text-[#1F1611]"
                    : "border-[#F0E6DD] bg-white text-[#6B5544] hover:bg-[#FFF5EE]",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="mt-4 block">
            <div className="mb-2 text-sm text-[#6B5544]">{t("coach.context")}</div>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
              rows={5}
              className="w-full rounded-3xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none"
            />
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={coachMutation.isPending}
            className="mt-4 w-full rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 transition hover:bg-[#E55329]"
          >
            {coachMutation.isPending ? t("coach.generating") : t("coach.generate")}
          </button>
          <div className="mt-1 text-center text-xs text-[#9C8B7A]">
            ⌘+Enter
          </div>
        </SectionCard>
      </div>

      {/* Right panel: conversation + structured response */}
      <div className="space-y-4">
        {/* Conversation history */}
        <SectionCard title={t("coach.response.title")} eyebrow={t("coach.response.eyebrow")}>
          {messages && messages.length > 0 ? (
            <div ref={scrollRef} className="max-h-[400px] space-y-3 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-[#FF6B35] text-white"
                        : "border border-[#F0E6DD] bg-[#FFF5EE] text-[#1F1611]"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              {coachMutation.isPending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-[#F0E6DD] bg-[#FFF5EE] px-4 py-3 text-sm text-[#9C8B7A]">
                    {t("coach.generating")}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-[#6B5544]">{t("coach.noResponse")}</div>
          )}

          {/* Quick replies */}
          {latestResponse && !coachMutation.isPending && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(t("coach.quickReply1") !== "coach.quickReply1" ? [
                t("coach.quickReply1"),
                t("coach.quickReply2"),
                t("coach.quickReply3"),
              ] : [
                "如果我今天没吃早餐呢？",
                "明天该怎么调整？",
                "推荐一个高蛋白加餐",
              ]).map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => handleQuickReply(reply)}
                  className="rounded-full border border-[#F0E6DD] bg-white px-3 py-1.5 text-xs text-[#6B5544] transition hover:bg-[#FFF5EE] hover:text-[#1F1611]"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Structured latest response */}
        {latestResponse ? (
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm">
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{t("coach.headline")}</div>
              <h2 className="mt-3 font-serif text-2xl text-[#1F1611] md:text-3xl">{latestResponse.headline}</h2>
              <p className="mt-4 leading-7 text-[#6B5544]">{latestResponse.summary}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm">
                <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{t("coach.score")}</div>
                <div className="mt-3 text-5xl font-semibold text-[#1F1611]">{latestResponse.score}</div>
              </div>
              <div className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm">
                <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{t("coach.disclaimer")}</div>
                <p className="mt-3 text-sm leading-6 text-[#6B5544]">{latestResponse.disclaimer}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [t("coach.riskAlerts"), latestResponse.riskAlerts],
                [t("coach.nutritionInsights"), latestResponse.nutritionInsights],
                [t("coach.nextActions"), latestResponse.nextActions],
                [t("coach.mealStrategy"), latestResponse.mealStrategy],
              ].map(([label, items]) => (
                <div
                  key={String(label)}
                  className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{label}</div>
                  <ul className="mt-4 space-y-2 text-[#6B5544]">
                    {(items as string[]).map((item, index) => (
                      <li key={`${label}-${index}`} className="rounded-2xl bg-[#FFF5EE] px-4 py-2 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Session history */}
        {sessions && sessions.length > 0 ? (
          <SectionCard title={t("coach.sessions.title")} eyebrow={t("coach.sessions.eyebrow")}>
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-[#F0E6DD] bg-[#FFF5EE] px-4 py-3"
                >
                  <div className="font-medium text-[#1F1611]">{session.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#9C8B7A]">
                    {session.focus.replace("_", " ")}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}
      </div>
    </div>
  );
}
