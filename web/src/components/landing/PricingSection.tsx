import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import { useLang } from "@/i18n/LanguageContext";

export function PricingSection() {
  const { t } = useLang();

  const plans = [
    {
      name: t("pricing.free.name"),
      price: t("pricing.free.price"),
      period: t("pricing.free.period"),
      desc: t("pricing.free.desc"),
      features: [
        t("pricing.free.f1"),
        t("pricing.free.f2"),
        t("pricing.free.f3"),
      ],
      cta: t("pricing.free.cta"),
      highlighted: false,
      badge: null,
    },
    {
      name: t("pricing.pro.name"),
      price: t("pricing.pro.price"),
      period: t("pricing.pro.period"),
      desc: t("pricing.pro.desc"),
      features: [
        t("pricing.pro.f1"),
        t("pricing.pro.f2"),
        t("pricing.pro.f3"),
        t("pricing.pro.f4"),
        t("pricing.pro.f5"),
      ],
      cta: t("pricing.pro.cta"),
      highlighted: true,
      badge: t("pricing.pro.badge"),
    },
    {
      name: t("pricing.pro2.name"),
      price: t("pricing.pro2.price"),
      period: t("pricing.pro2.period"),
      desc: t("pricing.pro2.desc"),
      features: [
        t("pricing.pro2.f1"),
        t("pricing.pro2.f2"),
        t("pricing.pro2.f3"),
        t("pricing.pro2.f4"),
        t("pricing.pro2.f5"),
      ],
      cta: t("pricing.pro2.cta"),
      highlighted: false,
      badge: null,
    },
  ];

  return (
    <section id="pricing" className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm md:p-10">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
          {t("pricing.eyebrow")}
        </div>
        <h2 className="mt-4 font-serif text-4xl text-[#1F1611] md:text-5xl">
          {t("pricing.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#6B5544]">
          {t("pricing.subtitle")}
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-[24px] border p-6 transition hover:-translate-y-0.5 ${
              plan.highlighted
                ? "border-[#FF6B35] bg-[#FFF5EE] shadow-[0_20px_60px_rgba(255,107,53,0.12)]"
                : "border-[#F0E6DD] bg-white shadow-warm hover:bg-[#FFF5EE]"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[#FF6B35] px-4 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="text-center">
              <div className="font-serif text-2xl text-[#1F1611]">{plan.name}</div>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="font-serif text-4xl font-bold text-[#1F1611]">{plan.price}</span>
                <span className="text-sm text-[#9C8B7A]">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-[#6B5544]">{plan.desc}</p>
            </div>

            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#6B5544]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B35]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex-1" />

            <Link
              to="/sign-up"
              className={`block rounded-full py-3 text-center text-sm font-semibold transition ${
                plan.highlighted
                  ? "bg-[#FF6B35] text-white hover:-translate-y-0.5 hover:bg-[#E55329]"
                  : "border border-[#F0E6DD] text-[#3D2817] hover:bg-[#FFF5EE]"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
