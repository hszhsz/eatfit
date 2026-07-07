import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useLang } from "@/i18n/LanguageContext";

export function CTABanner() {
  const { t } = useLang();

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#FF6B35]/20 bg-[linear-gradient(135deg,_#FF6B35_0%,_#E55329_50%,_#F59E0B_100%)] p-8 text-center shadow-[0_20px_60px_rgba(255,107,53,0.15)] md:p-12">
      <h2 className="font-serif text-3xl text-white md:text-5xl">
        {t("cta.title")}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/90">
        {t("cta.subtitle")}
      </p>
      <Link
        to="/app"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#FF6B35] transition hover:-translate-y-0.5 hover:bg-[#FFF9F2]"
      >
        {t("cta.button")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
