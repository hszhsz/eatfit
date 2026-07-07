import { Bot, ChartColumnBig, ClipboardList, ShieldCheck, Sparkles } from "lucide-react";

import { useLang } from "@/i18n/LanguageContext";

export function FeatureGrid() {
  const { t } = useLang();

  return (
    <section id="features" className="space-y-4">
      {/* Main feature — large card */}
      <div className="overflow-hidden rounded-[24px] border border-[#F0E6DD] bg-white shadow-warm">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_0.85fr]">
          {/* Text */}
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FFE5D9] px-3 py-1.5 text-xs font-medium text-[#FF6B35]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("features.main.title")}
            </div>
            <h2 className="mt-5 font-serif text-3xl leading-tight text-[#1F1611] md:text-4xl">
              {t("features.main.title")}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-[#6B5544]">
              {t("features.main.body")}
            </p>
          </div>
          {/* Visual */}
          <div className="h-full bg-gradient-to-br from-[#FFF5EE] to-[#FFE5D9] p-6 md:p-8">
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "🥪", label: "早餐", kcal: "420", color: "from-[#F59E0B] to-[#D97706]" },
                { emoji: "🥗", label: "午餐", kcal: "580", color: "from-[#22C55E] to-[#15803D]" },
                { emoji: "🐟", label: "晚餐", kcal: "520", color: "from-[#3B82F6] to-[#1E40AF]" },
                { emoji: "🥣", label: "加餐", kcal: "180", color: "from-[#A855F7] to-[#7E22CE]" },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl border border-[#F0E6DD] bg-white p-3 text-center shadow-sm">
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} text-lg`}>
                    {m.emoji}
                  </div>
                  <div className="mt-2 text-xs font-medium text-[#1F1611]">{m.label}</div>
                  <div className="text-[10px] text-[#9C8B7A]">{m.kcal} kcal</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary features — 3 small cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: t("features.adaptive.title"), body: t("features.adaptive.body"), icon: ChartColumnBig },
          { title: t("features.grocery.title"), body: t("features.grocery.body"), icon: ClipboardList },
          { title: t("features.security.title"), body: t("features.security.body"), icon: ShieldCheck },
        ].map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm transition hover:-translate-y-0.5 hover:bg-[#FFF5EE]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FF6B35]/20 bg-[#FFE5D9]">
                <Icon className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <h3 className="mt-4 font-serif text-2xl text-[#1F1611]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B5544]">{feature.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
