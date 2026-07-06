const steps = [
  {
    title: "01. Capture the profile",
    body: "Body metrics, activity level, goal, allergens, and preferences are saved to Supabase.",
  },
  {
    title: "02. Generate the day",
    body: "The dashboard requests a stateless plan and grocery list from the FastAPI nutrition engine.",
  },
  {
    title: "03. Tighten the loop",
    body: "The AI coach turns context into targeted advice and stores sessions for follow-up reviews.",
  },
];

export function WorkflowStrip() {
  return (
    <section className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm md:p-8">
      <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">Operating Flow</div>
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
