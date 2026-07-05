import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env, hasSupabase } from "@/lib/env";

export function createSupabaseClient(
  getToken: () => Promise<string | null>,
): SupabaseClient | null {
  if (!hasSupabase) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    accessToken: getToken,
  });
}
