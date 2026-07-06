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
          <div className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-4 text-[#1F1611]">
            <div className="max-w-2xl rounded-3xl border border-[#F0E6DD] bg-white p-8 shadow-warm">
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
                Missing Clerk key
              </div>
              <h1 className="mt-4 font-serif text-4xl">
                Add `VITE_CLERK_PUBLISHABLE_KEY` to continue.
              </h1>
              <p className="mt-6 leading-7 text-[#6B5544]">
                The landing page is available, but authentication screens and the protected dashboard require a valid Clerk publishable key.
              </p>
              <div className="mt-4 rounded-2xl bg-[#FFF5EE] p-4 text-sm text-[#6B5544]">
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
