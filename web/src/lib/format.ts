import type { ActivityLevel, Goal, MealType } from "@/types/eatfit";

export const mealLabels: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export const goalLabels: Record<Goal, string> = {
  lose_fat: "Fat Loss",
  maintain: "Maintenance",
  gain_muscle: "Muscle Gain",
};

export const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  light: "Light",
  moderate: "Moderate",
  active: "Active",
  very_active: "Very Active",
};

export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
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
