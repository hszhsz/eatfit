import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import {
  useCoachChatMutation,
  useCoachMessages,
  useCoachSessions,
} from "@/hooks/useDashboardData";
import type { CoachMessage, CoachResponse } from "@/types/eatfit";
import { useLang } from "@/i18n/LanguageContext";

/** Structured response card shown inline below assistant messages */
function StructuredCard({ response }: { response: CoachResponse }) {
  const { t } = useLang();

  const sections = [
    { key: "riskAlerts", label: t("coach.riskAlerts"), items: response.riskAlerts, color: "bg-red-50 border-red-200" },
    { key: "nutritionInsights", label: t("coach.nutritionInsights"), items: response.nutritionInsights, color: "bg-blue-50 border-blue-200" },
    { key: "nextActions", label: t("coach.nextActions"), items: response.nextActions, color: "bg-green-50 border-green-200" },
    { key: "mealStrategy", label: t("coach.mealStrategy"), items: response.mealStrategy, color: "bg-yellow-50 border-yellow-200" },
  ];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[#9C8B7A]">{t("coach.score")}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          response.score >= 80 ? "bg-green-100 text-green-800" :
          response.score >= 60 ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          {response.score}/100
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {sections.map((section) =>
          section.items && section.items.length > 0 ? (
            <div key={section.key} className={`rounded-xl border px-3 py-2 ${section.color}`}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9C8B7A]">
                {section.label}
              </div>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs text-[#6B5544] leading-relaxed">• {item}</li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>

      {response.disclaimer && (
        <p className="text-[10px] text-[#C4B5A5] italic">{response.disclaimer}</p>
      )}
    </div>
  );
}

/** Single chat message bubble */
function ChatBubble({ msg }: { msg: CoachMessage }) {
  const isUser = msg.role === "user";
  const hasStructured = msg.role === "assistant" && msg.structuredPayload;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[88%] ${isUser ? "order-1" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
            isUser
              ? "bg-[#FF6B35] text-white rounded-br-md"
              : "border border-[#F0E6DD] bg-white text-[#1F1611] rounded-bl-md"
          }`}
        >
          {msg.message}
        </div>
        {hasStructured && <StructuredCard response={msg.structuredPayload!} />}
      </div>
    </div>
  );
}

/** Typing indicator */
function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md border border-[#F0E6DD] bg-white px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]/40" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]/40" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]/40" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/** Focus label helper */
const FOCUS_LABELS: Record<string, string> = {
  daily_review: "每日复盘",
  meal_strategy: "饮食策略",
  eating_out: "外食建议",
  cravings: "嘴馋应对",
};

/** Session history sidebar */
function SessionSidebar({
  sessions,
  activeSessionId,
  onSelect,
  onNew,
}: {
  sessions: { id: string; title: string; focus: string; createdAt: string }[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const { t } = useLang();

  return (
    <div className="flex h-full flex-col">
      {/* New chat button */}
      <button
        type="button"
        onClick={onNew}
        className="mb-3 w-full rounded-2xl bg-[#FF6B35] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E55329]"
      >
        + {t("coach.sessions.newChat")}
      </button>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {sessions.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#9C8B7A]">
            {t("coach.noSessions")}
          </p>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelect(session.id)}
              className={`w-full rounded-2xl px-3 py-2.5 text-left transition ${
                activeSessionId === session.id
                  ? "border border-[#FF6B35]/30 bg-[#FFE5D9]"
                  : "border border-transparent hover:bg-[#FFF5EE]"
              }`}
            >
              <div className="truncate text-sm font-medium text-[#1F1611]">
                {session.title}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#9C8B7A]">
                <span>{new Date(session.createdAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}</span>
                <span className="rounded-full bg-[#F0E6DD] px-1.5 py-0.5 text-[10px]">
                  {FOCUS_LABELS[session.focus] || session.focus}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export function CoachPage() {
  const { data: profile } = useCurrentProfile();
  const { t } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: sessions = [] } = useCoachSessions(profile);
  const { data: messages = [] } = useCoachMessages(activeSessionId);
  const chatMutation = useCoachChatMutation(profile);

  // Auto-select latest session on load
  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input after response
  useEffect(() => {
    if (!chatMutation.isPending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatMutation.isPending]);

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

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending) return;

    setInput("");

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);

    const result = await chatMutation.mutateAsync({
      message: trimmed,
      sessionId: activeSessionId ?? undefined,
    });

    if (!activeSessionId && result.sessionId) {
      setActiveSessionId(result.sessionId);
    }
  }

  function handleNewSession() {
    setActiveSessionId(null);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-4">
      {/* Sidebar */}
      <div
        className={`shrink-0 transition-all duration-200 ${
          sidebarOpen ? "w-60" : "w-0 overflow-hidden"
        }`}
      >
        <div className="h-full w-60 rounded-[24px] border border-[#F0E6DD] bg-white p-3">
          <SessionSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelect={setActiveSessionId}
            onNew={handleNewSession}
          />
        </div>
      </div>

      {/* Main chat column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar: session title + sidebar toggle */}
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-xl border border-[#F0E6DD] bg-white px-2.5 py-2 text-sm text-[#6B5544] transition hover:bg-[#FFF5EE]"
            title={sidebarOpen ? "收起会话列表" : "展开会话列表"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor"/>
              <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/>
              <rect x="1" y="12" width="14" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
          <div className="flex-1 truncate text-sm font-medium text-[#1F1611]">
            {activeSessionId
              ? sessions.find((s) => s.id === activeSessionId)?.title ?? t("coach.sessions.title")
              : t("coach.sessions.newChat")}
          </div>
        </div>

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-[24px] border border-[#F0E6DD] bg-[#FFFBF7] p-5"
        >
          {messages.length === 0 && !activeSessionId ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 text-5xl">🥗</div>
              <h3 className="mb-2 font-serif text-xl text-[#1F1611]">
                {t("coach.sessions.greeting")}
              </h3>
              <p className="max-w-md text-sm text-[#6B5544]">
                {t("coach.sessions.greetingDesc")}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  "帮我复盘今天的饮食",
                  "推荐适合我的减脂食谱",
                  "我现在想吃东西怎么办",
                  "明天该怎么安排三餐",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setInput(prompt);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="rounded-full border border-[#F0E6DD] bg-white px-4 py-2 text-sm text-[#6B5544] transition hover:bg-[#FFF5EE]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-[#9C8B7A]">
              {t("coach.sessions.emptyChat")}
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} />
              ))}
              {chatMutation.isPending && <TypingBubble />}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="mt-4 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t("coach.sessions.inputPlaceholder")}
            disabled={chatMutation.isPending}
            className="flex-1 rounded-full border border-[#F0E6DD] bg-white px-5 py-3.5 text-sm text-[#1F1611] outline-none placeholder:text-[#C4B5A5] focus:border-[#FF6B35]/40 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            className="shrink-0 rounded-full bg-[#FF6B35] p-3.5 text-white transition hover:bg-[#E55329] disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10L18 2L10 18L8 12L2 10Z" fill="currentColor" />
              <path d="M10 18L8 12L18 2L10 18Z" fill="currentColor" fillOpacity="0.6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
