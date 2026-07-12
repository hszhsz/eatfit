import {
  ClerkProvider,
  useSession,
} from "@clerk/react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { BrowserRouter } from "react-router-dom";

import { createApiClient, type ApiClient } from "@/lib/api-client";
import { LanguageProvider } from "@/i18n/LanguageContext";

const queryClient = new QueryClient();
const ApiContext = createContext<ApiClient | null>(null);

function ApiProvider({ children }: PropsWithChildren) {
  const { session } = useSession();

  const api = useMemo(() => {
    return createApiClient(async () => {
      try {
        const token = await session?.getToken();
        if (!token) {
          console.warn("[eatfit] Clerk session token is null — user may need to sign in.");
          return null;
        }
        return token;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[eatfit] Failed to get Clerk token:", message);
        throw new Error(
          `Session storage error: ${message}. Try signing out and back in, or clear browser data for this site.`,
        );
      }
    });
  }, [session]);

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi(): ApiClient | null {
  return useContext(ApiContext);
}

// publishableKey is auto-detected from VITE_CLERK_PUBLISHABLE_KEY.
// Official quickstart says do NOT pass manually, but TS types in v6.11.3
// incorrectly mark it required (runtime uses options?.publishableKey).
// Cast to work around stale types: https://clerk.com/docs/react/getting-started/quickstart
const _ClerkProvider = ClerkProvider as React.FC<
  Omit<React.ComponentProps<typeof ClerkProvider>, 'publishableKey'>
>;

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <_ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <LanguageProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </LanguageProvider>
        </ApiProvider>
      </QueryClientProvider>
    </_ClerkProvider>
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
