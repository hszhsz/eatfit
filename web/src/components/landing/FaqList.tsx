import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { useLang } from "@/i18n/LanguageContext";

export function FaqList() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  const items = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

  return (
    <section className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm md:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{t("faq.eyebrow")}</div>
          <h2 className="mt-4 max-w-md font-serif text-4xl text-[#1F1611]">
            {t("faq.heading")}
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-[#F0E6DD] bg-[#FFF9F2]"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <span className="text-sm font-medium text-[#1F1611]">{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[#9C8B7A] transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm leading-7 text-[#6B5544]">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
