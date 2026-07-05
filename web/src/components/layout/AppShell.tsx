import { UserButton, useUser } from "@clerk/react";
import {
  Bot,
  ChartColumnBig,
  ChefHat,
  ClipboardList,
  Home,
  NotebookPen,
  Salad,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/app", label: "Overview", icon: Home, end: true },
  { to: "/app/profile", label: "Profile", icon: NotebookPen },
  { to: "/app/plan", label: "Plan", icon: ChartColumnBig },
  { to: "/app/recipes", label: "Recipes", icon: ChefHat },
  { to: "/app/grocery", label: "Grocery", icon: ClipboardList },
  { to: "/app/coach", label: "AI Coach", icon: Bot },
];

export function AppShell() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#060816] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 xl:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-black/20 px-6 py-8 backdrop-blur xl:border-b-0 xl:border-r">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8cffb0]/30 bg-[#8cffb0]/10">
              <Salad className="h-6 w-6 text-[#8cffb0]" />
            </div>
            <div>
              <div className="font-serif text-2xl tracking-wide">EatFit</div>
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Nutrition OS
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              Signed in as
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-zinc-100">
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                </div>
                <div className="text-sm text-zinc-400">
                  Personalized nutrition dashboard
                </div>
              </div>
              <UserButton />
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                      isActive
                        ? "bg-[#8cffb0] text-[#04120a]"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-transparent p-4 text-sm text-zinc-300">
            <div className="font-medium text-white">Operating note</div>
            <p className="mt-2 leading-6 text-zinc-400">
              Profile data lives in Supabase. Plans and coaching are computed from your latest inputs through the FastAPI nutrition engine.
            </p>
          </div>
        </aside>

        <main className="px-4 py-4 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
