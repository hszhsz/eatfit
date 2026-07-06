import type { ActivityLevel, Goal, MealType } from "@/types/eatfit";
import type { Lang } from "@/i18n/translations";

export function getMealLabels(lang: Lang): Record<MealType, string> {
  const dict: Record<Lang, Record<MealType, string>> = {
    en: {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
    },
    zh: {
      breakfast: "早餐",
      lunch: "午餐",
      dinner: "晚餐",
      snack: "加餐",
    },
  };
  return dict[lang];
}

export function getGoalLabels(lang: Lang): Record<Goal, string> {
  const dict: Record<Lang, Record<Goal, string>> = {
    en: {
      lose_fat: "Fat Loss",
      maintain: "Maintenance",
      gain_muscle: "Muscle Gain",
    },
    zh: {
      lose_fat: "减脂",
      maintain: "保持",
      gain_muscle: "增肌",
    },
  };
  return dict[lang];
}

export function getActivityLabels(lang: Lang): Record<ActivityLevel, string> {
  const dict: Record<Lang, Record<ActivityLevel, string>> = {
    en: {
      sedentary: "Sedentary",
      light: "Light",
      moderate: "Moderate",
      active: "Active",
      very_active: "Very Active",
    },
    zh: {
      sedentary: "久坐",
      light: "轻度",
      moderate: "中度",
      active: "活跃",
      very_active: "极度活跃",
    },
  };
  return dict[lang];
}

// Backward-compatible static maps (English defaults)
export const mealLabels: Record<MealType, string> = getMealLabels("en");
export const goalLabels: Record<Goal, string> = getGoalLabels("en");
export const activityLabels: Record<ActivityLevel, string> =
  getActivityLabels("en");

export function formatNumber(value: number, digits = 0, lang: Lang = "en") {
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatDateLabel(value: string, lang: Lang = "en") {
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(value));
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinTags(items: string[]) {
  return items.join(", ");
}
