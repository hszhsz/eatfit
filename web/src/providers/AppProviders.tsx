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
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { BrowserRouter } from "react-router-dom";
import type { SupabaseClient } from "@supabase/supabase-js";

import { env, hasSupabase } from "@/lib/env";
import { createSupabaseClient } from "@/lib/supabase";
import { LanguageProvider } from "@/i18n/LanguageContext";

const queryClient = new QueryClient();
const SupabaseContext = createContext<SupabaseClient | null>(null);

/**
 * Stores the most recent Clerk token-retrieval error so the UI can surface a
 * helpful recovery tip instead of just a generic Supabase 401/403.
 */
const ClerkSessionErrorContext = createContext<string | null>(null);

function SupabaseProvider({ children }: PropsWithChildren) {
  const { getToken } = useAuth();
  const lastErrorRef = useRef<string | null>(null);
  const [, forceRender] = useState(0);

  const setError = useCallback((msg: string | null) => {
    lastErrorRef.current = msg;
    forceRender((n) => n + 1);
  }, []);

  const client = useMemo(() => {
    if (!hasSupabase) {
      return null;
    }

    return createSupabaseClient(async () => {
      try {
        const token = await getToken();
        if (!token) {
          return null;
        }
        // Token retrieved successfully — clear any previous error.
        setError(null);
        return token;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        console.error(
          "[eatfit] Failed to retrieve Clerk session token:",
          message,
        );
        const stack = error instanceof Error ? error.stack : undefined;
        if (stack) {
          console.error("[eatfit] Stack:", stack);
        }

        // Persist the error so the UI can show a recovery tip. We return
        // null so supabase-js falls back to the anon key (RLS will then
        // produce a 401/403 for writes — still confusing, but at least
        // the user sees the tip alongside it).
        setError(message);
        return null;
      }
    });
  }, [getToken, setError]);

  return (
    <SupabaseContext.Provider value={client}>
      <ClerkSessionErrorContext.Provider value={lastErrorRef.current}>
        {children}
      </ClerkSessionErrorContext.Provider>
    </SupabaseContext.Provider>
  );
}

export function useSupabaseClient() {
  return useContext(SupabaseContext);
}

/**
 * Returns the most recent Clerk session error message (e.g. IndexedDB
 * "No suitable key or wrong key type"), or null if token retrieval succeeded.
 */
export function useClerkSessionError() {
  return useContext(ClerkSessionErrorContext);
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
