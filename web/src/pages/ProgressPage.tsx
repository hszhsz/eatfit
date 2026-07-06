import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useLang } from "@/i18n/LanguageContext";
import { useSupabaseClient } from "@/providers/AppProviders";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchWeightLogs, upsertWeightLog } from "@/lib/logs";
import { formatNumber, todayIso } from "@/lib/format";

export function ProgressPage() {
  const { data: profile } = useCurrentProfile();
  const client = useSupabaseClient();
  const queryClient = useQueryClient();
  const { lang, t } = useLang();
  const [weightInput, setWeightInput] = useState("");

  const { data: weightLogs, isLoading } = useQuery({
    queryKey: ["weight-logs", profile?.id],
    queryFn: () => {
      if (!client || !profile) return [];
      return fetchWeightLogs(client, profile.id, 30);
    },
    enabled: Boolean(client && profile),
  });

  const logWeightMutation = useMutation({
    mutationFn: () => {
      if (!client || !profile) throw new Error("No client");
      return upsertWeightLog(client, profile.id, todayIso(), Number(weightInput));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weight-logs", profile?.id] });
      setWeightInput("");
    },
  });

  // Calculate trend
  const trend = useMemo(() => {
    if (!weightLogs || weightLogs.length < 2) return null;
    const latest = weightLogs[weightLogs.length - 1];
    const first = weightLogs[0];
    const diff = latest.weightKg - first.weightKg;
    const days = Math.max(
      1,
      Math.round((new Date(latest.logDate).getTime() - new Date(first.logDate).getTime()) / 86400000),
    );
    return { diff, days, latest: latest.weightKg, first: first.weightKg };
  }, [weightLogs]);

  // Build SVG sparkline path
  const sparkline = useMemo(() => {
    if (!weightLogs || weightLogs.length < 2) return null;
    const w = 600;
    const h = 160;
    const pad = 20;
    const weights = weightLogs.map((l) => l.weightKg);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const range = maxW - minW || 1;
    const stepX = (w - pad * 2) / (weights.length - 1);
    const points = weights.map((wt, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((wt - minW) / range) * (h - pad * 2);
      return `${x},${y}`;
    });
    return {
      path: `M ${points.join(" L ")}`,
      area: `M ${pad},${h - pad} L ${points.join(" L ")} L ${w - pad},${h - pad} Z`,
      w, h, pad,
      points: points.map((p) => p.split(",").map(Number)),
    };
  }, [weightLogs]);

  if (!profile) {
    return (
      <EmptyState
        title={lang === "zh" ? "先设置档案" : "Set up your profile first"}
        body={lang === "zh" ? "需要先创建营养档案才能查看进度。" : "Create a profile to track progress."}
        cta={lang === "zh" ? "设置档案" : "Set Up Profile"}
        to="/app/profile"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Weight input */}
      <SectionCard
        title={lang === "zh" ? "记录体重" : "Log Weight"}
        eyebrow={todayIso()}
      >
        <div className="flex flex-wrap items-end gap-3">
          <label className="block">
            <div className="mb-1 text-xs text-[#6B5544]">{lang === "zh" ? "今日体重 (kg)" : "Today's Weight (kg)"}</div>
            <input
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder={profile ? String(profile.weightKg) : ""}
              className="w-40 rounded-xl border border-[#F0E6DD] bg-white px-3 py-2 text-sm outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => logWeightMutation.mutate()}
            disabled={!weightInput || logWeightMutation.isPending}
            className="rounded-full bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {logWeightMutation.isPending ? "..." : lang === "zh" ? "保存" : "Save"}
          </button>
          {logWeightMutation.isSuccess && (
            <span className="text-sm text-[#FF6B35]">✓</span>
          )}
        </div>
      </SectionCard>

      {/* Trend summary */}
      {trend && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#F0E6DD] bg-white p-5 shadow-warm">
            <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
              {lang === "zh" ? "当前体重" : "Current Weight"}
            </div>
            <div className="mt-3 text-3xl font-semibold text-[#1F1611]">
              {formatNumber(trend.latest, 1, lang)} kg
            </div>
          </div>
          <div className="rounded-3xl border border-[#F0E6DD] bg-white p-5 shadow-warm">
            <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
              {lang === "zh" ? "总体变化" : "Total Change"}
            </div>
            <div className={`mt-3 flex items-center gap-2 text-3xl font-semibold ${trend.diff < 0 ? "text-green-600" : "text-[#FF6B35]"}`}>
              {trend.diff < 0 ? <TrendingDown className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
              {trend.diff > 0 ? "+" : ""}{formatNumber(trend.diff, 1, lang)} kg
            </div>
          </div>
          <div className="rounded-3xl border border-[#F0E6DD] bg-white p-5 shadow-warm">
            <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
              {lang === "zh" ? "记录天数" : "Days Tracked"}
            </div>
            <div className="mt-3 text-3xl font-semibold text-[#1F1611]">{trend.days}</div>
          </div>
        </div>
      )}

      {/* Weight chart */}
      <SectionCard
        title={lang === "zh" ? "体重趋势" : "Weight Trend"}
        eyebrow={lang === "zh" ? "最近 30 天" : "Last 30 days"}
      >
        {isLoading ? (
          <div className="h-48 animate-pulse rounded-2xl bg-[#FFF5EE]" />
        ) : !weightLogs || weightLogs.length === 0 ? (
          <div className="py-8 text-center text-[#6B5544]">
            {lang === "zh" ? "还没有体重记录，先在上方记录今日体重。" : "No weight data yet. Log today's weight above."}
          </div>
        ) : weightLogs.length < 2 ? (
          <div className="py-8 text-center text-[#6B5544]">
            {lang === "zh" ? "至少需要 2 条记录才能显示趋势。" : "Need at least 2 entries to show a trend."}
          </div>
        ) : sparkline ? (
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${sparkline.w} ${sparkline.h}`} className="w-full min-w-[400px]" style={{ maxHeight: "240px" }}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <line
                  key={p}
                  x1={sparkline.pad} y1={sparkline.pad + p * (sparkline.h - sparkline.pad * 2)}
                  x2={sparkline.w - sparkline.pad} y2={sparkline.pad + p * (sparkline.h - sparkline.pad * 2)}
                  stroke="#F0E6DD" strokeWidth="1"
                />
              ))}
              {/* Area */}
              <path d={sparkline.area} fill="url(#weightGradient)" />
              {/* Line */}
              <path d={sparkline.path} fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {/* Dots */}
              {sparkline.points.map((pt, i) => (
                <circle key={i} cx={pt[0]} cy={pt[1]} r="3" fill="#FF6B35" />
              ))}
            </svg>
            <div className="mt-2 flex justify-between text-xs text-[#9C8B7A]">
              <span>{weightLogs[0]?.logDate}</span>
              <span>{weightLogs[weightLogs.length - 1]?.logDate}</span>
            </div>
          </div>
        ) : null}
      </SectionCard>

      {/* History table */}
      {weightLogs && weightLogs.length > 0 && (
        <SectionCard title={lang === "zh" ? "历史记录" : "History"} eyebrow={`${weightLogs.length} ${lang === "zh" ? "条" : "entries"}`}>
          <div className="space-y-2">
            {[...weightLogs].reverse().map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-2xl border border-[#F0E6DD] bg-[#FFF5EE] px-4 py-3"
              >
                <span className="text-sm text-[#6B5544]">{log.logDate}</span>
                <span className="text-sm font-medium text-[#1F1611]">{formatNumber(log.weightKg, 1, lang)} kg</span>
                {log.note && <span className="text-xs text-[#9C8B7A]">{log.note}</span>}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
