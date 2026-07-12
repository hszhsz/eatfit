import {
  ClerkProvider,
  useAuth,
} from "@clerk/react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { BrowserRouter } from "react-router-dom";
import type { SupabaseClient } from "@supabase/supabase-js";

import { env, hasSupabase } from "@/lib/env";
import { createSupabaseClient } from "@/lib/supabase";
import { LanguageProvider } from "@/i18n/LanguageContext";

const queryClient = new QueryClient();
const SupabaseContext = createContext<SupabaseClient | null>(null);

function SupabaseProvider({ children }: PropsWithChildren) {
  const { getToken } = useAuth();
  const client = useMemo(() => {
    if (!hasSupabase) {
      return null;
    }

    return createSupabaseClient(async () => {
      try {
        // Use Clerk session tokens so Supabase can validate them via the
        // current third-party Clerk integration instead of the deprecated
        // custom JWT template flow.
        const token = await getToken();
        if (!token) {
          // No active session → return null so supabase-js falls back to the
          // anonymous (anon) key, which RLS will reject for write operations.
          return null;
        }
        return token;
      } catch (error) {
        // Clerk's session storage can throw IndexedDB errors like
        // "No suitable key or wrong key type" when the browser's local
        // schema is stale (e.g. after a Clerk version bump or a hard
        // refresh). Surface the failure so callers can show a helpful
        // "please sign out and back in" message instead of a generic
        // 401/403 from Supabase.
        const message =
          error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        // Use console.error so it shows up red in devtools even if
        // warnings are filtered, and include the full stack so we can
        // pinpoint where the IndexedDB error is being thrown from.
        console.error(
          "[eatfit] Failed to retrieve Clerk session token:",
          message,
        );
        if (stack) {
          console.error("[eatfit] Stack:", stack);
        }
        if (
          typeof message === "string" &&
          /no suitable key|wrong key type/i.test(message)
        ) {
          throw new Error(
            "CLERK_SESSION_STORAGE_ERROR: Your browser has stale Clerk " +
              "session data. Please sign out and sign back in to refresh it.",
          );
        }
        // Re-throw unknown errors so the real root cause isn't hidden
        // behind a generic 42501 from Supabase.
        throw error instanceof Error
          ? new Error(`CLERK_GET_TOKEN_FAILED: ${message}`)
          : new Error("CLERK_GET_TOKEN_FAILED: unknown error");
      }
    });
    // We intentionally only depend on `getToken`; the client only needs
    // to be rebuilt when the getToken function reference changes.
  }, [getToken]);

  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseClient() {
  return useContext(SupabaseContext);
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ClerkProvider
      publishableKey={env.clerkPublishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <LanguageProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </LanguageProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export function PreviewProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
