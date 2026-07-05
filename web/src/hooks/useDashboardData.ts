import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchCoachAdvice, fetchGrocery, fetchPlan, fetchRecipes } from "@/lib/api";
import {
  createCoachExchange,
  getPlanSnapshot,
  listCoachMessages,
  listCoachSessions,
  saveGrocerySnapshot,
  savePlanSnapshot,
} from "@/lib/data";
import { useSupabaseClient } from "@/providers/AppProviders";
import type {
  CoachRequest,
  DailyPlan,
  UserProfile,
} from "@/types/eatfit";

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });
}

export function usePlan(profile: UserProfile | null, selectedDate: string) {
  const client = useSupabaseClient();

  return useQuery({
    queryKey: ["plan", profile?.id, selectedDate],
    queryFn: async () => {
      if (!profile) {
        return null;
      }

      if (client) {
        const snapshot = await getPlanSnapshot(client, profile.id, selectedDate);
        if (snapshot?.meals) {
          return {
            date: snapshot.plan_date,
            profileId: 0,
            target: snapshot.target,
            meals: snapshot.meals,
            totalCalories: Number(snapshot.total_calories),
            totalProteinG: Number(snapshot.total_protein_g),
            totalCarbsG: Number(snapshot.total_carbs_g),
            totalFatG: Number(snapshot.total_fat_g),
          } as DailyPlan;
        }
      }

      const plan = await fetchPlan(profile, selectedDate);
      if (client) {
        await savePlanSnapshot(client, profile.id, plan);
      }
      return plan;
    },
    enabled: Boolean(profile),
  });
}

export function useGrocery(profile: UserProfile | null, selectedDate: string) {
  const client = useSupabaseClient();

  return useQuery({
    queryKey: ["grocery", profile?.id, selectedDate],
    queryFn: async () => {
      if (!profile) {
        return null;
      }

      const grocery = await fetchGrocery(profile, selectedDate);
      if (client) {
        await saveGrocerySnapshot(client, profile.id, grocery);
      }
      return grocery;
    },
    enabled: Boolean(profile),
  });
}

export function useCoachSessions(profile: UserProfile | null) {
  const client = useSupabaseClient();

  return useQuery({
    queryKey: ["coach-sessions", profile?.id],
    queryFn: async () => {
      if (!client || !profile) {
        return [];
      }
      return listCoachSessions(client, profile.id);
    },
    enabled: Boolean(client && profile),
  });
}

export function useCoachMessages(sessionId?: string) {
  const client = useSupabaseClient();

  return useQuery({
    queryKey: ["coach-messages", sessionId],
    queryFn: async () => {
      if (!client || !sessionId) {
        return [];
      }
      return listCoachMessages(client, sessionId);
    },
    enabled: Boolean(client && sessionId),
  });
}

export function useCoachMutation(profile: UserProfile | null, date: string) {
  const client = useSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CoachRequest) => {
      if (!profile) {
        throw new Error("Profile is required before using the coach.");
      }

      const response = await fetchCoachAdvice(profile, date, payload);
      let sessionId: string | null = null;

      if (client) {
        sessionId = await createCoachExchange(
          client,
          profile.id,
          response.headline,
          payload.focus,
          payload.message || "",
          response,
        );
      }

      return { response, sessionId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["coach-sessions", profile?.id],
      });
    },
  });
}
