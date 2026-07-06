import { useLang } from "@/i18n/LanguageContext";

export function FaqList() {
  const { t } = useLang();

  const items = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{t("faq.eyebrow")}</div>
        <h2 className="mt-4 max-w-md font-serif text-4xl text-[#1F1611]">
          {t("faq.heading")}
        </h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.question}
            className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm"
          >
            <h3 className="text-lg font-medium text-[#1F1611]">{item.question}</h3>
            <p className="mt-3 leading-7 text-[#6B5544]">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
