const items = [
  {
    question: "Where is user data stored?",
    answer:
      "Web user data is stored in Supabase under row-level security policies bound to the Clerk user identity.",
  },
  {
    question: "What powers the nutrition logic?",
    answer:
      "The existing FastAPI backend handles nutrition targets, meal planning, grocery aggregation, and AI coaching orchestration.",
  },
  {
    question: "Can the dashboard be used without a profile?",
    answer:
      "You can sign in and browse the shell, but planning and coaching stay locked until the nutrition profile is saved.",
  },
];

export function FaqList() {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">FAQ</div>
        <h2 className="mt-4 max-w-md font-serif text-4xl text-white">
          Built for a real product surface, not a one-page demo.
        </h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.question}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6"
          >
            <h3 className="text-lg font-medium text-white">{item.question}</h3>
            <p className="mt-3 leading-7 text-zinc-400">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
