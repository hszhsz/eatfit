import { create } from "zustand";

import { todayIso } from "@/lib/format";
import type { CoachFocus } from "@/types/eatfit";

interface DashboardStore {
  selectedDate: string;
  coachFocus: CoachFocus;
  setSelectedDate: (value: string) => void;
  setCoachFocus: (value: CoachFocus) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedDate: todayIso(),
  coachFocus: "daily_review",
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setCoachFocus: (coachFocus) => set({ coachFocus }),
}));
