import { Apple, Download, Smartphone } from "lucide-react";

import { useLang } from "@/i18n/LanguageContext";

export function AppDownload() {
  const { t } = useLang();

  return (
    <section id="download" className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm md:p-10">
      <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{t("download.eyebrow")}</div>
      <h2 className="mt-4 font-serif text-4xl text-[#1F1611] md:text-5xl">
        {t("download.title")}
      </h2>
      <p className="mt-4 max-w-2xl leading-7 text-[#6B5544]">
        {t("download.subtitle")}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* Android */}
        <div className="flex items-center gap-5 rounded-[24px] border border-[#F0E6DD] bg-[#FFF5EE] p-6 transition hover:-translate-y-0.5 hover:bg-white">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#FF6B35]/20 bg-[#FFE5D9]">
            <Smartphone className="h-6 w-6 text-[#FF6B35]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-serif text-2xl text-[#1F1611]">{t("download.android.title")}</div>
            <p className="mt-1 text-sm leading-6 text-[#6B5544]">
              {t("download.android.desc")}
            </p>
          </div>
          <a
            href="/downloads/eatfit-android-v2.0.apk"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#E55329]"
          >
            <Download className="h-4 w-4" />
            {t("download.android.button")}
          </a>
        </div>

        {/* iOS */}
        <div className="flex items-center gap-5 rounded-[24px] border border-[#F0E6DD] bg-[#FFF5EE] p-6 transition hover:-translate-y-0.5 hover:bg-white">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#FF6B35]/20 bg-[#FFE5D9]">
            <Apple className="h-6 w-6 text-[#FF6B35]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-serif text-2xl text-[#1F1611]">{t("download.ios.title")}</div>
            <p className="mt-1 text-sm leading-6 text-[#6B5544]">
              {t("download.ios.desc")}
            </p>
          </div>
          <a
            href="https://github.com/hszhsz/eatfit/tree/main/ios"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#F0E6DD] px-5 py-2.5 text-sm font-semibold text-[#3D2817] transition hover:bg-[#FFF5EE]"
          >
            {t("download.ios.button")}
          </a>
        </div>
      </div>

      {/* Web shortcut */}
      <div className="mt-4 flex items-center gap-5 rounded-[24px] border border-[#F0E6DD] bg-[#FFF5EE] p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#FF6B35]/20 bg-[#FFE5D9]">
          <Download className="h-6 w-6 text-[#FF6B35]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-serif text-2xl text-[#1F1611]">{t("download.web.title")}</div>
          <p className="mt-1 text-sm leading-6 text-[#6B5544]">
            {t("download.web.desc")}
          </p>
        </div>
        <a
          href="/sign-up"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#F0E6DD] px-5 py-2.5 text-sm font-semibold text-[#3D2817] transition hover:bg-white"
        >
          {t("download.web.button")}
        </a>
      </div>

      {/* QR code */}
      <div className="mt-8 flex flex-col items-center gap-3 rounded-[24px] border border-[#F0E6DD] bg-[#FFF5EE] p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-serif text-2xl text-[#1F1611]">{t("download.qr.title")}</div>
          <p className="mt-2 text-sm leading-6 text-[#6B5544]">
            {t("download.qr.desc")}
          </p>
        </div>
        <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-[#F0E6DD] bg-white p-3">
          <img
            src="/downloads/qr-code.svg"
            alt="EatFit QR Code"
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
