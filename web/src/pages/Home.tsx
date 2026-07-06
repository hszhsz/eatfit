import { EatFitLogo } from "@/components/common/EatFitLogo";
import { Link } from "react-router-dom";

import { AppDownload } from "@/components/landing/AppDownload";
import { FaqList } from "@/components/landing/FaqList";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { LandingHero } from "@/components/landing/LandingHero";
import { WorkflowStrip } from "@/components/landing/WorkflowStrip";
import { useLang } from "@/i18n/LanguageContext";

export default function Home() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-[#FFF9F2] px-4 py-4 text-[#1F1611] md:px-8 md:py-8">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#F0E6DD] bg-white px-6 py-4 shadow-warm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FF6B35]/30 bg-[#FFE5D9]">
              <EatFitLogo className="h-6 w-6 text-[#FF6B35]" />
            </div>
            <div>
              <div className="font-serif text-2xl">{t("home.brand")}</div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
                {t("home.brandTagline")}
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <a
              href="#features"
              className="rounded-full px-4 py-2 text-sm text-[#6B5544] transition hover:bg-[#FFF5EE] hover:text-[#1F1611]"
            >
              {t("home.nav.features")}
            </a>
            <a
              href="#download"
              className="rounded-full px-4 py-2 text-sm text-[#6B5544] transition hover:bg-[#FFF5EE] hover:text-[#1F1611]"
            >
              {t("home.nav.download")}
            </a>
            <LanguageSwitcher />
            <Link
              to="/sign-in"
              className="rounded-full border border-[#F0E6DD] px-4 py-2 text-sm text-[#3D2817] transition hover:bg-[#FFF5EE]"
            >
              {t("home.nav.signIn")}
            </Link>
            <Link
              to="/sign-up"
              className="rounded-full bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#E55329]"
            >
              {t("home.nav.getStarted")}
            </Link>
          </nav>
        </header>

        <LandingHero />
        <FeatureGrid />
        <WorkflowStrip />
        <AppDownload />
        <FaqList />

        <footer className="rounded-[24px] border border-[#F0E6DD] bg-white px-6 py-8 text-sm text-[#6B5544] shadow-warm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-serif text-lg text-[#1F1611]">{t("home.brand")}</div>
              <p className="mt-1 max-w-md leading-6 text-[#9C8B7A]">
                {t("footer.desc")}
              </p>
            </div>
            <div className="text-[#9C8B7A]">
              {t("footer.copyright")}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
