import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes } from "react-router-dom";

import App from "@/App";
import { PreviewProviders, AppProviders } from "@/providers/AppProviders";
import Home from "@/pages/Home";
import { env, hasClerk } from "@/lib/env";
import "./index.css";

function MissingClerkApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-[#060816] px-4 text-white">
            <div className="max-w-2xl rounded-[32px] border border-white/10 bg-black/20 p-8">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Missing Clerk key
              </div>
              <h1 className="mt-4 font-serif text-4xl">
                Add `VITE_CLERK_PUBLISHABLE_KEY` to continue.
              </h1>
              <p className="mt-6 leading-7 text-zinc-400">
                The landing page is available, but authentication screens and the protected dashboard require a valid Clerk publishable key.
              </p>
              <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-zinc-300">
                Current value: {env.clerkPublishableKey ? "configured" : "missing"}
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {hasClerk ? (
      <AppProviders>
        <App />
      </AppProviders>
    ) : (
      <PreviewProviders>
        <MissingClerkApp />
      </PreviewProviders>
    )}
  </StrictMode>,
);
