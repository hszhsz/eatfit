import { useUser } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentProfile, upsertProfile } from "@/lib/data";
import { useSupabaseClient } from "@/providers/AppProviders";
import type { UserProfileFormValues } from "@/types/eatfit";

export function useCurrentProfile() {
  const client = useSupabaseClient();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!client || !user) {
        return null;
      }

      return getCurrentProfile(client, user.id);
    },
    enabled: Boolean(client && user),
  });

  const mutation = useMutation({
    mutationFn: async (values: UserProfileFormValues) => {
      if (!client || !user) {
        throw new Error("Supabase or user session is unavailable.");
      }

      return upsertProfile(client, user.id, values);
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
