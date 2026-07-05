import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(140,255,176,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(201,178,118,0.18),_transparent_24%),rgba(255,255,255,0.03)] px-6 py-8 md:px-10 md:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(130deg,transparent_0%,rgba(255,255,255,0.04)_48%,transparent_80%)]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-zinc-300">
            <Sparkles className="h-3.5 w-3.5 text-[#8cffb0]" />
            Official Website + Product Dashboard
          </div>

          <h1 className="mt-8 max-w-3xl font-serif text-5xl leading-[1.02] text-white md:text-7xl">
            The nutrition platform that looks as sharp as the discipline it builds.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            EatFit pairs a premium brand surface with a full daily operating system:
            personalized targets, meal planning, grocery aggregation, and an AI coach that pushes the next best move.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-[#8cffb0] px-6 py-3 text-sm font-semibold text-[#04120a] transition hover:-translate-y-0.5"
            >
              Start With Clerk
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-zinc-200 transition hover:bg-white/5"
            >
              Explore Dashboard
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[32px] border border-white/10 bg-black/30 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  Today’s Operating Board
                </div>
                <div className="mt-3 font-serif text-3xl text-white">2,214 kcal target</div>
              </div>
              <div className="rounded-2xl border border-[#8cffb0]/20 bg-[#8cffb0]/10 p-3">
                <Bot className="h-5 w-5 text-[#8cffb0]" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Protein", "142 g"],
                ["Carbs", "231 g"],
                ["Fat", "63 g"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {label}
                  </div>
                  <div className="mt-2 text-xl font-medium text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Plan Quality</div>
              <div className="mt-3 text-4xl font-semibold text-white">92</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Structured coaching with risk alerts, next actions, and meal strategy.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Flow</div>
              <ul className="mt-3 space-y-3 text-sm text-zinc-300">
                <li>Clerk authentication</li>
                <li>Supabase persistence</li>
                <li>FastAPI nutrition engine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
