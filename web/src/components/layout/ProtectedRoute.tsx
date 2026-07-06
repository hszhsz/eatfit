import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";

import { useLang } from "@/i18n/LanguageContext";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useLang();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F2] text-[#6B5544]">
        {t("protected.loading")}
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
