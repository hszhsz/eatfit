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

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLang } from "@/i18n/LanguageContext";

export function AppShell() {
  const { user } = useUser();
  const { t } = useLang();

  const navItems = [
    { to: "/app", label: t("shell.nav.overview"), icon: Home, end: true },
    { to: "/app/profile", label: t("shell.nav.profile"), icon: NotebookPen },
    { to: "/app/plan", label: t("shell.nav.plan"), icon: ChartColumnBig },
    { to: "/app/recipes", label: t("shell.nav.recipes"), icon: ChefHat },
    { to: "/app/grocery", label: t("shell.nav.grocery"), icon: ClipboardList },
    { to: "/app/coach", label: t("shell.nav.coach"), icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#1F1611]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 xl:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#F0E6DD] bg-white px-6 py-8 xl:border-b-0 xl:border-r">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6B35]/30 bg-[#FFE5D9]">
              <Salad className="h-6 w-6 text-[#FF6B35]" />
            </div>
            <div>
              <div className="font-serif text-2xl tracking-wide">EatFit</div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
                {t("shell.brandTagline")}
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-[#F0E6DD] bg-[#FFF5EE] p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
              {t("shell.signedInAs")}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-[#1F1611]">
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                </div>
                <div className="text-sm text-[#6B5544]">
                  {t("shell.signedInDesc")}
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
                        ? "bg-[#FF6B35] text-white"
                        : "text-[#6B5544] hover:bg-[#FFF5EE] hover:text-[#1F1611]",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-10 rounded-3xl border border-[#F0E6DD] bg-gradient-to-br from-[#FFF5EE] to-transparent p-4 text-sm text-[#6B5544]">
            <div className="font-medium text-[#1F1611]">{t("shell.operatingNote")}</div>
            <p className="mt-2 leading-6 text-[#6B5544]">
              {t("shell.operatingDesc")}
            </p>
          </div>

          <div className="mt-6">
            <LanguageSwitcher />
          </div>
        </aside>

        <main className="px-4 py-4 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
