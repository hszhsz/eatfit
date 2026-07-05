import { Bot, ChartColumnBig, ClipboardList, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Adaptive macro targets",
    body: "FastAPI computes BMR, TDEE, and macro distribution directly from profile inputs and goal state.",
    icon: ChartColumnBig,
  },
  {
    title: "AI coach with structure",
    body: "Advice is returned with a headline, summary, score, risks, insights, next actions, and meal strategy.",
    icon: Bot,
  },
  {
    title: "Grocery built from plan",
    body: "Ingredients are aggregated by category so daily planning turns into an executable shopping list.",
    icon: ClipboardList,
  },
  {
    title: "User data isolation",
    body: "Clerk secures identity and Supabase RLS isolates every profile, plan snapshot, and coach session.",
    icon: ShieldCheck,
  },
];

export function FeatureGrid() {
  return (
    <section id="dashboard" className="grid gap-4 lg:grid-cols-2">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <article
            key={feature.title}
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8cffb0]/20 bg-[#8cffb0]/10">
              <Icon className="h-5 w-5 text-[#8cffb0]" />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-white">{feature.title}</h2>
            <p className="mt-4 max-w-xl leading-7 text-zinc-400">{feature.body}</p>
          </article>
        );
      })}
    </section>
  );
}
