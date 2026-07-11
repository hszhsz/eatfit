export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://eatfit-backend.vercel.app",
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
};

export const hasClerk = Boolean(env.clerkPublishableKey);
export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey);
