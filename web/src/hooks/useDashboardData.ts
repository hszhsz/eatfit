import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchCoachAdvice, fetchGrocery, fetchPlan, fetchRecipes } from "@/lib/api";
import type {
  CoachRequest,
  UserProfile,
} from "@/types/eatfit";

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });
}

export function usePlan(profile: UserProfile | null, selectedDate: string) {
  return useQuery({
    queryKey: ["plan", profile?.id, selectedDate],
    queryFn: async () => {
      if (!profile) return null;
      return fetchPlan(profile, selectedDate, profile.id);
    },
    enabled: Boolean(profile),
  });
}

export function useGrocery(profile: UserProfile | null, selectedDate: string) {
  return useQuery({
    queryKey: ["grocery", profile?.id, selectedDate],
    queryFn: async () => {
      if (!profile) return null;
      return fetchGrocery(profile, selectedDate, profile.id);
    },
    enabled: Boolean(profile),
  });
}

export function useCoachSessions(profile: UserProfile | null) {
  return useQuery({
    queryKey: ["coach-sessions", profile?.id],
    queryFn: async () => {
      // TODO: migrate coach session CRUD from Supabase to backend API
      return [];
    },
    enabled: Boolean(profile),
  });
}

export function useCoachMessages(sessionId?: string) {
  return useQuery({
    queryKey: ["coach-messages", sessionId],
    queryFn: async () => {
      // TODO: migrate coach message CRUD from Supabase to backend API
      return [];
    },
    enabled: Boolean(sessionId),
  });
}

export function useCoachMutation(profile: UserProfile | null, date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CoachRequest) => {
      if (!profile) {
        throw new Error("Profile is required before using the coach.");
      }
      const response = await fetchCoachAdvice(profile, date, payload, profile.id);
      return { response, sessionId: null as string | null };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["coach-sessions", profile?.id],
      });
    },
  });
}
