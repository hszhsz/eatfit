import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060816] text-zinc-200">
        Loading your workspace...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
