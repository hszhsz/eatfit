import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { useLang } from "@/i18n/LanguageContext";

export function LandingHero() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#F0E6DD] bg-[radial-gradient(circle_at_top_left,_rgba(255,107,53,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.10),_transparent_24%),rgba(255,255,255,0.6)] px-6 py-12 shadow-warm md:px-10 md:py-16">
      <div className="absolute inset-0 bg-[linear-gradient(130deg,transparent_0%,rgba(255,107,53,0.04)_48%,transparent_80%)]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: copy + CTA */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F0E6DD] bg-[#FFF5EE] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#6B5544]">
            <Sparkles className="h-3.5 w-3.5 text-[#FF6B35]" />
            {t("hero.badge")}
          </div>

          <h1 className="mt-8 max-w-3xl font-serif text-5xl leading-[1.05] text-[#1F1611] md:text-7xl">
            {t("hero.title")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6B5544]">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#E55329]"
            >
              {t("hero.ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#showcase"
              className="inline-flex items-center gap-2 rounded-full border border-[#F0E6DD] px-7 py-3.5 text-sm text-[#3D2817] transition hover:bg-[#FFF5EE]"
            >
              {t("hero.ctaSecondary")}
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-10 flex gap-8">
            <div>
              <div className="font-serif text-3xl text-[#FF6B35]">{t("hero.stat1")}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#9C8B7A]">
                {t("hero.stat1.label")}
              </div>
            </div>
            <div className="border-l border-[#F0E6DD] pl-8">
              <div className="font-serif text-3xl text-[#1F1611]">{t("hero.stat2")}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#9C8B7A]">
                {t("hero.stat2.label")}
              </div>
            </div>
            <div className="border-l border-[#F0E6DD] pl-8">
              <div className="font-serif text-3xl text-[#1F1611]">{t("hero.stat3")}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#9C8B7A]">
                {t("hero.stat3.label")}
              </div>
            </div>
          </div>
        </div>

        {/* Right: phone mockup */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-[260px] md:w-[300px]">
            {/* Phone frame */}
            <div className="relative rounded-[40px] border-[3px] border-[#1F1611] bg-[#1F1611] p-3 shadow-[0_30px_80px_rgba(255,107,53,0.18)]">
              {/* Notch */}
              <div className="absolute left-1/2 top-[10px] z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-[#1F1611]" />
              {/* Screen */}
              <div className="overflow-hidden rounded-[28px] bg-[#FFF9F2]">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pb-1 pt-2 text-[10px] text-[#1F1611]">
                  <span>9:41</span>
                  <span>📶 📡 🔋</span>
                </div>
                {/* App header */}
                <div className="px-5 pb-3 pt-2">
                  <div className="text-[10px] text-[#9C8B7A]">周三 · 6月17日 · 早安</div>
                  <div className="mt-1 font-serif text-lg text-[#1F1611]">
                    今天吃 <span className="text-[#FF6B35]">什么</span>
                  </div>
                </div>
                {/* Profile card */}
                <div className="mx-4 rounded-2xl border border-[#F0E6DD] bg-white p-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#9C8B7A]">🎯 目标</span>
                    <span className="font-semibold text-[#1F1611]">减脂 / 减重 4kg</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-[#9C8B7A]">🔥 今日卡路里</span>
                    <span className="font-semibold text-[#1F1611]">1850 kcal</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#F0E6DD]">
                    <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#FF6B35] to-[#7CB342]" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#F0E6DD] pt-2 text-center">
                    <div>
                      <div className="text-sm font-bold text-[#FF6B35]">75</div>
                      <div className="text-[9px] text-[#9C8B7A]">体重(kg)</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1F1611]">18.2</div>
                      <div className="text-[9px] text-[#9C8B7A]">BMI</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1F1611]">16%</div>
                      <div className="text-[9px] text-[#9C8B7A]">体脂率</div>
                    </div>
                  </div>
                </div>
                {/* Meal items */}
                <div className="mt-3 space-y-2 px-4 pb-4">
                  {[
                    { emoji: "🥪", type: "早餐 · 已完成 ✓", name: "牛油果鸡蛋三明治", kcal: "420", color: "from-[#F59E0B] to-[#D97706]" },
                    { emoji: "🥗", type: "午餐 · 进行中", name: "香煎鸡胸肉藜麦碗", kcal: "580", color: "from-[#22C55E] to-[#15803D]" },
                    { emoji: "🐟", type: "晚餐 · 18:30", name: "清蒸鲈鱼配西兰花", kcal: "520", color: "from-[#3B82F6] to-[#1E40AF]" },
                    { emoji: "🥣", type: "加餐 · 15:00", name: "希腊酸奶蓝莓碗", kcal: "180", color: "from-[#A855F7] to-[#7E22CE]" },
                  ].map((meal) => (
                    <div key={meal.name} className="flex items-center gap-2 rounded-xl border border-[#F0E6DD] bg-white p-2">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${meal.color} text-base`}>
                        {meal.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] text-[#FF6B35]">{meal.type}</div>
                        <div className="truncate text-[11px] font-semibold text-[#1F1611]">{meal.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#1F1611]">{meal.kcal}</div>
                        <div className="text-[8px] text-[#9C8B7A]">kcal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
