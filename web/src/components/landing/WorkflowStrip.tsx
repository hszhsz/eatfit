import { useLang } from "@/i18n/LanguageContext";

export function WorkflowStrip() {
  const { t } = useLang();

  const steps = [
    {
      title: t("workflow.step1.title"),
      body: t("workflow.step1.body"),
    },
    {
      title: t("workflow.step2.title"),
      body: t("workflow.step2.body"),
    },
    {
      title: t("workflow.step3.title"),
      body: t("workflow.step3.body"),
    },
  ];

  return (
    <section className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm md:p-8">
      <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{t("workflow.eyebrow")}</div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.title}
            className="rounded-[24px] border border-[#F0E6DD] bg-[#FFF5EE] p-5"
          >
            <h3 className="font-serif text-2xl text-[#1F1611]">{step.title}</h3>
            <p className="mt-4 leading-7 text-[#6B5544]">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
