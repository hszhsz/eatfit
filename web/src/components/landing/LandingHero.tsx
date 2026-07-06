import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#F0E6DD] bg-[radial-gradient(circle_at_top_left,_rgba(255,107,53,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.10),_transparent_24%),rgba(255,255,255,0.6)] px-6 py-8 shadow-warm md:px-10 md:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(130deg,transparent_0%,rgba(255,107,53,0.04)_48%,transparent_80%)]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F0E6DD] bg-[#FFF5EE] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#6B5544]">
            <Sparkles className="h-3.5 w-3.5 text-[#FF6B35]" />
            Product Dashboard
          </div>

          <h1 className="mt-8 max-w-3xl font-serif text-5xl leading-[1.02] text-[#1F1611] md:text-7xl">
            The nutrition platform that looks as sharp as the discipline it builds.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6B5544]">
            EatFit pairs a premium brand surface with a full daily operating system:
            personalized targets, meal planning, grocery aggregation, and an AI coach that pushes the next best move.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#E55329]"
            >
              Start With Clerk
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[#F0E6DD] px-6 py-3 text-sm text-[#3D2817] transition hover:bg-[#FFF5EE]"
            >
              Explore Dashboard
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
                  Today's Operating Board
                </div>
                <div className="mt-3 font-serif text-3xl text-[#1F1611]">2,214 kcal target</div>
              </div>
              <div className="rounded-2xl border border-[#FF6B35]/20 bg-[#FFE5D9] p-3">
                <Bot className="h-5 w-5 text-[#FF6B35]" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Protein", "142 g"],
                ["Carbs", "231 g"],
                ["Fat", "63 g"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[#FFF5EE] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#9C8B7A]">
                    {label}
                  </div>
                  <div className="mt-2 text-xl font-medium text-[#1F1611]">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm">
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">Plan Quality</div>
              <div className="mt-3 text-4xl font-semibold text-[#1F1611]">92</div>
              <p className="mt-2 text-sm leading-6 text-[#6B5544]">
                Structured coaching with risk alerts, next actions, and meal strategy.
              </p>
            </div>
            <div className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm">
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">Flow</div>
              <ul className="mt-3 space-y-3 text-sm text-[#6B5544]">
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
