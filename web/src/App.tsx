import { Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { env, hasSupabase } from "@/lib/env";
import { CoachPage } from "@/pages/CoachPage";
import { DashboardHome } from "@/pages/DashboardHome";
import { GroceryPage } from "@/pages/GroceryPage";
import Home from "@/pages/Home";
import { PlanPage } from "@/pages/PlanPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RecipesPage } from "@/pages/RecipesPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";

function SetupMissingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-4 text-[#1F1611]">
      <div className="max-w-2xl rounded-[24px] border border-[#F0E6DD] bg-white p-8 shadow-warm">
        <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">Configuration required</div>
        <h1 className="mt-4 font-serif text-4xl">Finish the environment wiring.</h1>
        <p className="mt-6 leading-7 text-[#6B5544]">
          EatFit Web needs a Clerk publishable key and Supabase frontend credentials in the `web/` environment before authentication and persistence can run end to end.
        </p>
        <div className="mt-6 rounded-2xl bg-[#FFF5EE] p-4 text-sm text-[#6B5544]">
          <div>VITE_CLERK_PUBLISHABLE_KEY: {env.clerkPublishableKey ? "configured" : "missing"}</div>
          <div>VITE_SUPABASE_URL: {env.supabaseUrl ? "configured" : "missing"}</div>
          <div>VITE_SUPABASE_ANON_KEY: {hasSupabase ? "configured" : "missing"}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="plan" element={<PlanPage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="grocery" element={<GroceryPage />} />
        <Route path="coach" element={<CoachPage />} />
      </Route>
      <Route path="*" element={<SetupMissingPage />} />
    </Routes>
  );
}
