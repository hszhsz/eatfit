import { useLang } from "@/i18n/LanguageContext";

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "zh" : "en")}
      className="rounded-full border border-[#F0E6DD] px-4 py-2 text-sm text-[#6B5544] transition hover:bg-[#FFF5EE] hover:text-[#1F1611]"
    >
      {lang === "en" ? "中文" : "EN"}
    </button>
  );
}
