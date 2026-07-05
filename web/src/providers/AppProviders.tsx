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
        return await getToken({ template: "supabase" });
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
          <BrowserRouter>{children}</BrowserRouter>
        </SupabaseProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export function PreviewProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}
