import { Bot, ChartColumnBig, ClipboardList, ShieldCheck } from "lucide-react";

import { useLang } from "@/i18n/LanguageContext";

export function FeatureGrid() {
  const { t } = useLang();

  const features = [
    {
      title: t("features.adaptive.title"),
      body: t("features.adaptive.body"),
      icon: ChartColumnBig,
    },
    {
      title: t("features.coach.title"),
      body: t("features.coach.body"),
      icon: Bot,
    },
    {
      title: t("features.grocery.title"),
      body: t("features.grocery.body"),
      icon: ClipboardList,
    },
    {
      title: t("features.security.title"),
      body: t("features.security.body"),
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="features" className="grid gap-4 lg:grid-cols-2">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <article
            key={feature.title}
            className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm transition hover:-translate-y-0.5 hover:bg-[#FFF5EE]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6B35]/20 bg-[#FFE5D9]">
              <Icon className="h-5 w-5 text-[#FF6B35]" />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-[#1F1611]">{feature.title}</h2>
            <p className="mt-4 max-w-xl leading-7 text-[#6B5544]">{feature.body}</p>
          </article>
        );
      })}
    </section>
  );
}
