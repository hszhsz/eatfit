import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useDashboardStore } from "@/store/dashboardStore";
import { useLang } from "@/i18n/LanguageContext";
import { useSupabaseClient } from "@/providers/AppProviders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFoodLog, deleteFoodLog, fetchFoodLogs } from "@/lib/logs";
import { formatNumber, getMealLabels } from "@/lib/format";
import type { MealType } from "@/types/eatfit";

export function FoodLogPage() {
  const { data: profile } = useCurrentProfile();
  const selectedDate = useDashboardStore((s) => s.selectedDate);
  const client = useSupabaseClient();
  const queryClient = useQueryClient();
  const { lang } = useLang();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    mealType: "breakfast" as MealType,
    foodName: "",
    calories: "",
    proteinG: "",
    carbsG: "",
    fatG: "",
  });

  const { data: logs, isLoading } = useQuery({
    queryKey: ["food-logs", profile?.id, selectedDate],
    queryFn: () => {
      if (!client || !profile) return [];
      return fetchFoodLogs(client, profile.id, selectedDate);
    },
    enabled: Boolean(client && profile),
  });

  const addMutation = useMutation({
    mutationFn: () => {
      if (!client || !profile) throw new Error("No client");
      return addFoodLog(client, profile.id, {
        logDate: selectedDate,
        mealType: form.mealType,
        foodName: form.foodName,
        calories: Number(form.calories) || 0,
        proteinG: Number(form.proteinG) || 0,
        carbsG: Number(form.carbsG) || 0,
        fatG: Number(form.fatG) || 0,
        source: "manual",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food-logs", profile?.id, selectedDate] });
      setShowForm(false);
      setForm({ mealType: "breakfast", foodName: "", calories: "", proteinG: "", carbsG: "", fatG: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!client) throw new Error("No client");
      return deleteFoodLog(client, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food-logs", profile?.id, selectedDate] });
    },
  });

  const mealLabels = getMealLabels(lang);

  const grouped = useMemo(() => {
    const g: Record<string, typeof logs> = { breakfast: [], lunch: [], dinner: [], snack: [] };
    (logs || []).forEach((log) => {
      if (!g[log.mealType]) g[log.mealType] = [];
      g[log.mealType].push(log);
    });
    return g;
  }, [logs]);

  const totals = useMemo(() => {
    const all = logs || [];
    return {
      calories: all.reduce((s, l) => s + l.calories, 0),
      protein: all.reduce((s, l) => s + l.proteinG, 0),
      carbs: all.reduce((s, l) => s + l.carbsG, 0),
      fat: all.reduce((s, l) => s + l.fatG, 0),
    };
  }, [logs]);

  if (!profile) {
    return (
      <EmptyState
        title={lang === "zh" ? "先设置档案" : "Set up your profile first"}
        body={lang === "zh" ? "需要先创建营养档案才能记录饮食。" : "Create a nutrition profile before logging food."}
        cta={lang === "zh" ? "设置档案" : "Set Up Profile"}
        to="/app/profile"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [lang === "zh" ? "已记录热量" : "Logged Calories", `${formatNumber(totals.calories, 0, lang)} kcal`],
          [lang === "zh" ? "蛋白质" : "Protein", `${formatNumber(totals.protein, 1, lang)} g`],
          [lang === "zh" ? "碳水" : "Carbs", `${formatNumber(totals.carbs, 1, lang)} g`],
          [lang === "zh" ? "脂肪" : "Fat", `${formatNumber(totals.fat, 1, lang)} g`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-[#F0E6DD] bg-white p-5 shadow-warm">
            <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{label}</div>
            <div className="mt-3 text-2xl font-semibold text-[#1F1611]">{value}</div>
          </div>
        ))}
      </div>

      <SectionCard
        title={lang === "zh" ? "饮食记录" : "Food Log"}
        eyebrow={selectedDate}
        action={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#E55329]"
          >
            <Plus className="h-4 w-4" />
            {lang === "zh" ? "添加记录" : "Add Entry"}
          </button>
        }
      >
        {showForm && (
          <div className="mb-6 rounded-2xl border border-[#F0E6DD] bg-[#FFF5EE] p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <div className="mb-1 text-xs text-[#6B5544]">{lang === "zh" ? "餐次" : "Meal"}</div>
                <select
                  value={form.mealType}
                  onChange={(e) => setForm({ ...form, mealType: e.target.value as MealType })}
                  className="w-full rounded-xl border border-[#F0E6DD] bg-white px-3 py-2 text-sm outline-none"
                >
                  {Object.entries(mealLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <div className="mb-1 text-xs text-[#6B5544]">{lang === "zh" ? "食物名称" : "Food Name"}</div>
                <input
                  value={form.foodName}
                  onChange={(e) => setForm({ ...form, foodName: e.target.value })}
                  placeholder={lang === "zh" ? "如：鸡胸肉沙拉" : "e.g. Chicken Salad"}
                  className="w-full rounded-xl border border-[#F0E6DD] bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block">
                <div className="mb-1 text-xs text-[#6B5544]">{lang === "zh" ? "热量 (kcal)" : "Calories (kcal)"}</div>
                <input
                  type="number"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  className="w-full rounded-xl border border-[#F0E6DD] bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block">
                <div className="mb-1 text-xs text-[#6B5544]">{lang === "zh" ? "蛋白质 (g)" : "Protein (g)"}</div>
                <input
                  type="number"
                  value={form.proteinG}
                  onChange={(e) => setForm({ ...form, proteinG: e.target.value })}
                  className="w-full rounded-xl border border-[#F0E6DD] bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block">
                <div className="mb-1 text-xs text-[#6B5544]">{lang === "zh" ? "碳水 (g)" : "Carbs (g)"}</div>
                <input
                  type="number"
                  value={form.carbsG}
                  onChange={(e) => setForm({ ...form, carbsG: e.target.value })}
                  className="w-full rounded-xl border border-[#F0E6DD] bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block">
                <div className="mb-1 text-xs text-[#6B5544]">{lang === "zh" ? "脂肪 (g)" : "Fat (g)"}</div>
                <input
                  type="number"
                  value={form.fatG}
                  onChange={(e) => setForm({ ...form, fatG: e.target.value })}
                  className="w-full rounded-xl border border-[#F0E6DD] bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => addMutation.mutate()}
              disabled={!form.foodName || !form.calories || addMutation.isPending}
              className="mt-3 rounded-full bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {addMutation.isPending ? "..." : lang === "zh" ? "保存" : "Save"}
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#FFF5EE]" />
            ))}
          </div>
        ) : (logs || []).length === 0 ? (
          <div className="py-8 text-center text-[#6B5544]">
            {lang === "zh" ? "今天还没有记录，点击「添加记录」开始。" : "No entries yet. Click \"Add Entry\" to start."}
          </div>
        ) : (
          <div className="space-y-4">
            {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((mt) => {
              const items = grouped[mt] || [];
              if (items.length === 0) return null;
              const mealTotal = items.reduce((s, l) => s + l.calories, 0);
              return (
                <div key={mt}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1F1611]">{mealLabels[mt]}</span>
                    <span className="text-xs text-[#9C8B7A]">{formatNumber(mealTotal, 0, lang)} kcal</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-2xl border border-[#F0E6DD] bg-[#FFF5EE] px-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-[#1F1611]">{log.foodName}</div>
                          <div className="mt-1 flex gap-3 text-xs text-[#9C8B7A]">
                            <span>{formatNumber(log.calories, 0, lang)} kcal</span>
                            <span>P {formatNumber(log.proteinG, 0, lang)}g</span>
                            <span>C {formatNumber(log.carbsG, 0, lang)}g</span>
                            <span>F {formatNumber(log.fatG, 0, lang)}g</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(log.id)}
                          className="ml-3 shrink-0 text-[#9C8B7A] transition hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
