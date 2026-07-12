import { useUser } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/providers/AppProviders";
import type { UserProfileFormValues, UserProfile } from "@/types/eatfit";
import type { ProfileResponse } from "@/lib/api-client";

function mapProfileResponse(profile: ProfileResponse): UserProfile {
  return {
    id: profile.id,
    clerkUserId: profile.clerk_user_id,
    name: profile.name,
    gender: profile.gender as "male" | "female",
    age: profile.age,
    heightCm: Number(profile.height_cm),
    weightKg: Number(profile.weight_kg),
    bodyFatPct: profile.body_fat_pct ? Number(profile.body_fat_pct) : null,
    activityLevel: profile.activity_level as UserProfile["activityLevel"],
    goal: profile.goal as UserProfile["goal"],
    allergens: Array.isArray(profile.allergens) ? profile.allergens : [],
    dislikedTags: Array.isArray(profile.disliked_tags) ? profile.disliked_tags : [],
    dietPreference: profile.diet_preference,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

export function useCurrentProfile() {
  const api = useApi();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!api || !user) return null;
      return api.getProfile().then((p) => (p ? mapProfileResponse(p) : null));
    },
    enabled: Boolean(api && user),
  });

  const mutation = useMutation({
    mutationFn: async (values: UserProfileFormValues) => {
      if (!api || !user) {
        throw new Error("API client or user session is unavailable. Please sign in again.");
      }
      const profile = await api.upsertProfile(values);
      return mapProfileResponse(profile);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", user?.id], profile);
    },
  });

  return {
    ...query,
    saveProfile: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
}
