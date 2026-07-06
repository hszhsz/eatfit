import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes } from "react-router-dom";

import App from "@/App";
import { PreviewProviders, AppProviders } from "@/providers/AppProviders";
import Home from "@/pages/Home";
import { useLang } from "@/i18n/LanguageContext";
import { env, hasClerk } from "@/lib/env";
import "./index.css";

function MissingClerkApp() {
  const { t } = useLang();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-4 text-[#1F1611]">
            <div className="max-w-2xl rounded-3xl border border-[#F0E6DD] bg-white p-8 shadow-warm">
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
                {t("noclerk.eyebrow")}
              </div>
              <h1 className="mt-4 font-serif text-4xl">
                {t("noclerk.title")}
              </h1>
              <p className="mt-6 leading-7 text-[#6B5544]">
                {t("noclerk.desc")}
              </p>
              <div className="mt-4 rounded-2xl bg-[#FFF5EE] p-4 text-sm text-[#6B5544]">
                {t("noclerk.current")}: {env.clerkPublishableKey ? t("setup.configured") : t("setup.missing")}
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
