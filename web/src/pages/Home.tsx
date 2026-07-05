import { Salad } from "lucide-react";
import { Link } from "react-router-dom";

import { FaqList } from "@/components/landing/FaqList";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { LandingHero } from "@/components/landing/LandingHero";
import { WorkflowStrip } from "@/components/landing/WorkflowStrip";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060816] px-4 py-4 text-white md:px-8 md:py-8">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-black/20 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8cffb0]/30 bg-[#8cffb0]/10">
              <Salad className="h-5 w-5 text-[#8cffb0]" />
            </div>
            <div>
              <div className="font-serif text-2xl">EatFit</div>
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Official Site
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <a
              href="#dashboard"
              className="rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Features
            </a>
            <Link
              to="/sign-in"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="rounded-full bg-[#8cffb0] px-4 py-2 text-sm font-semibold text-[#04120a] transition hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </nav>
        </header>

        <LandingHero />
        <FeatureGrid />
        <WorkflowStrip />
        <FaqList />

        <footer className="rounded-[28px] border border-white/10 bg-black/20 px-6 py-6 text-sm text-zinc-400">
          EatFit Web pairs Clerk authentication, Supabase persistence, and the existing FastAPI nutrition engine into one production-ready surface.
        </footer>
      </div>
    </div>
  );
}
