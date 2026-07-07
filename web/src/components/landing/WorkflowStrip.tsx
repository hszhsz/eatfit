import { useLang } from "@/i18n/LanguageContext";

export function WorkflowStrip() {
  const { t } = useLang();

  const steps = [
    {
      num: "01",
      title: t("workflow.step1.title"),
      body: t("workflow.step1.body"),
      emoji: "📊",
    },
    {
      num: "02",
      title: t("workflow.step2.title"),
      body: t("workflow.step2.body"),
      emoji: "🤖",
    },
    {
      num: "03",
      title: t("workflow.step3.title"),
      body: t("workflow.step3.body"),
      emoji: "🛒",
    },
  ];

  return (
    <section className="rounded-[24px] border border-[#1F1611] bg-[#1F1611] p-6 md:p-10">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
          {t("workflow.eyebrow")}
        </div>
        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl text-[#FFF9F2] md:text-5xl">
          {t("workflow.title")}
        </h2>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.num} className="relative">
            {/* Connector arrow */}
            {i < steps.length - 1 && (
              <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-[#FF6B35] md:block">
                →
              </div>
            )}
            <article className="rounded-[20px] border border-[#3D2817] bg-[#2A1F18] p-5 transition hover:border-[#FF6B35]/40">
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl text-[#FF6B35]">{step.num}</span>
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl text-[#FFF9F2]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#9C8B7A]">{step.body}</p>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
