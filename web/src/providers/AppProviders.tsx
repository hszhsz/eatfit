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
        return await getToken();
      } catch {
        return null;
      }
    });
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
