import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchCoachAdvice,
  fetchCoachMessages,
  fetchCoachSessions,
  fetchGrocery,
  fetchPlan,
  fetchRecipes,
  sendCoachChatMessage,
} from "@/lib/api";
import type { CoachRequest, UserProfile } from "@/types/eatfit";

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

// ---------- Coach Chat Hooks ----------

export function useCoachSessions(profile: UserProfile | null) {
  return useQuery({
    queryKey: ["coach-sessions", profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      return fetchCoachSessions(profile.id);
    },
    enabled: Boolean(profile?.id),
  });
}

export function useCoachMessages(sessionId?: string | null) {
  return useQuery({
    queryKey: ["coach-messages", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      return fetchCoachMessages(sessionId);
    },
    enabled: Boolean(sessionId),
  });
}

export function useCoachChatMutation(profile: UserProfile | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      sessionId,
      date,
    }: {
      message: string;
      sessionId?: string;
      date?: string;
    }) => {
      if (!profile) throw new Error("Profile required");
      return sendCoachChatMessage(profile.id, message, sessionId, date);
    },
    onSuccess: (data) => {
      // Invalidate sessions list and messages for this session
      queryClient.invalidateQueries({ queryKey: ["coach-sessions", profile?.id] });
      queryClient.invalidateQueries({ queryKey: ["coach-messages", data.sessionId] });
    },
  });
}

// Legacy: kept for backward compatibility with the old coach flow
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
