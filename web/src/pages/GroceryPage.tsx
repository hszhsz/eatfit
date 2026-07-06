import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useGrocery } from "@/hooks/useDashboardData";
import { formatNumber } from "@/lib/format";
import { useDashboardStore } from "@/store/dashboardStore";
import { useLang } from "@/i18n/LanguageContext";
import { useState } from "react";

export function GroceryPage() {
  const { data: profile } = useCurrentProfile();
  const selectedDate = useDashboardStore((state) => state.selectedDate);
  const { data: grocery, isLoading, error } = useGrocery(profile, selectedDate);
  const { lang, t } = useLang();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  if (!profile) {
    return (
      <EmptyState
        title={t("grocery.empty.title")}
        body={t("grocery.empty.body")}
        cta={t("grocery.empty.cta")}
        to="/app/profile"
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard title={t("grocery.title")} eyebrow={t("grocery.eyebrow")}>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-3xl bg-[#FFF5EE]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{String(error.message)}</div>
        ) : grocery ? (
          <>
            <div className="mb-4 text-sm text-[#6B5544]">
              {checked.size} / {grocery.items.length} {lang === "zh" ? "项已勾选" : "items checked"}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(grocery.grouped).map(([category, items]) => (
                <article
                  key={category}
                  className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm"
                >
                  <div className="mb-4 text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
                    {category}
                  </div>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const key = `${category}-${item.name}`;
                      const isChecked = checked.has(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggle(key)}
                          className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition ${
                            isChecked
                              ? "border-[#FF6B35]/30 bg-[#FFE5D9] opacity-60"
                              : "border-[#F0E6DD] bg-[#FFF5EE]"
                          }`}
                        >
                          <span className={`flex items-center gap-3 text-[#3D2817] ${isChecked ? "line-through" : ""}`}>
                            <span className={`flex h-4 w-4 items-center justify-center rounded border ${isChecked ? "border-[#FF6B35] bg-[#FF6B35] text-white" : "border-[#E8DDD3] bg-transparent"}`}>
                              {isChecked ? "✓" : ""}
                            </span>
                            {item.name}
                          </span>
                          <span className="text-sm text-[#6B5544]">
                            {formatNumber(item.totalAmountG, 1, lang)} g
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-[#6B5544]">{t("grocery.generateFirst")}</div>
        )}
      </SectionCard>
    </div>
  );
}
