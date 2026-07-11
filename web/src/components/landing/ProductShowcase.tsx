import type { ReactNode } from "react";
import { useLang } from "@/i18n/LanguageContext";

/**
 * Three phone screenshots showing the core product flow:
 * Dashboard → AI Meal Plan → Grocery List
 */
export function ProductShowcase() {
  const { t } = useLang();

  const screens = [
    {
      label: t("showcase.screen1"),
      desc: t("showcase.screen1.desc"),
      content: <DashboardMock />,
    },
    {
      label: t("showcase.screen2"),
      desc: t("showcase.screen2.desc"),
      content: <MealPlanMock />,
    },
    {
      label: t("showcase.screen3"),
      desc: t("showcase.screen3.desc"),
      content: <GroceryMock />,
    },
  ];

  return (
    <section id="showcase" className="rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm md:p-10">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
          {t("showcase.eyebrow")}
        </div>
        <h2 className="mt-4 font-serif text-4xl text-[#1F1611] md:text-5xl">
          {t("showcase.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6B5544]">
          {t("showcase.subtitle")}
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {screens.map((screen) => (
          <div key={screen.label} className="flex flex-col items-center">
            <PhoneFrame>{screen.content}</PhoneFrame>
            <div className="mt-4 text-center">
              <div className="font-serif text-xl text-[#1F1611]">{screen.label}</div>
              <div className="mt-1 text-sm text-[#9C8B7A]">{screen.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-[270px]">
      <div className="absolute left-0 top-[104px] h-14 w-1.5 rounded-r-full bg-[#2C1A11] shadow-[2px_0_6px_rgba(0,0,0,0.2)]" />
      <div className="absolute left-0 top-[150px] h-10 w-1 rounded-r-full bg-[#3A2418]" />
      <div className="absolute right-0 top-[136px] h-16 w-1.5 rounded-l-full bg-[#2C1A11] shadow-[-2px_0_6px_rgba(0,0,0,0.18)]" />

      <div className="relative rounded-[42px] bg-[linear-gradient(160deg,#3B2316_0%,#120A07_38%,#2B170F_68%,#0F0907_100%)] p-[7px] shadow-[0_28px_60px_rgba(31,22,17,0.22),0_10px_20px_rgba(255,107,53,0.12)] ring-1 ring-[#4A2E20]/20">
        <div className="pointer-events-none absolute inset-[7px] rounded-[35px] bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_18%,transparent_82%,rgba(255,255,255,0.08))]" />

        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[35px] bg-[linear-gradient(180deg,#F8F3ED_0%,#F6EFE8_100%)]">
          <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0))]" />
          <div className="absolute left-1/2 top-3 z-20 h-7 w-32 -translate-x-1/2 rounded-full bg-[#1B100C] shadow-[inset_0_-1px_0_rgba(255,255,255,0.05),0_2px_8px_rgba(0,0,0,0.28)]" />

          <div className="relative z-10 flex h-full flex-col px-4 pb-3 pt-4">
            <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-semibold tracking-[0.02em] text-[#4C3A2F]">
              <span>9:41</span>
              <div className="flex items-center gap-1 text-[9px] text-[#6B5544]">
                <span>▮▮▮</span>
                <span>◔</span>
              </div>
            </div>

            <div className="mt-3 flex-1 overflow-hidden rounded-[28px] border border-white/70 bg-[#FFFCF9]/88 px-4 pb-4 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_24px_rgba(125,92,69,0.08)] backdrop-blur-sm">
              {children}
            </div>

            <div className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-[#2B1A11]/78" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Mock screens --- */

function DashboardMock() {
  return (
    <div>
      <div className="text-[10px] text-[#9C8B7A]">周二 · 6月17日 · 早安</div>
      <div className="mt-1 text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#1F1611]">
        今天吃 <span className="text-[#FF6B35]">什么</span>
      </div>

      <div className="mt-4 rounded-[22px] border border-[#E9DDD2] bg-[#FFF8F3] p-4 shadow-[0_10px_22px_rgba(125,92,69,0.05)]">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-[10px] font-semibold tracking-[0.08em] text-[#9C8B7A]">今日目标</div>
            <div className="text-[14px] font-semibold text-[#1F1611]">减脂 / 减重 4kg</div>
            <div className="text-[10px] text-[#9C8B7A]">已完成 1145 / 1850 kcal</div>
          </div>
          <div className="relative h-16 w-16">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="31" stroke="#F0E6DD" strokeWidth="8" fill="none" />
              <circle
                cx="40"
                cy="40"
                r="31"
                stroke="#FF6B35"
                strokeWidth="8"
                fill="none"
                strokeDasharray="194.8"
                strokeDashoffset="74"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[15px] font-bold text-[#FF6B35]">62%</div>
              <div className="text-[8px] text-[#9C8B7A]">完成</div>
            </div>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EFE5DC]">
          <div className="h-full w-[62%] rounded-full bg-[linear-gradient(90deg,#FF6B35,#7CB342)]" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "体重(kg)", value: "75", accent: true },
            { label: "BMI", value: "18.2" },
            { label: "体脂率", value: "16%" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/75 px-2 py-2">
              <div className={`text-[12px] font-bold ${item.accent ? "text-[#FF6B35]" : "text-[#1F1611]"}`}>
                {item.value}
              </div>
              <div className="mt-0.5 text-[8px] text-[#9C8B7A]">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {[
          { label: "蛋白质", val: "123g", target: "150g", pct: 82, color: "#FF6B35" },
          { label: "碳水", val: "145g", target: "200g", pct: 72, color: "#7CB342" },
          { label: "脂肪", val: "42g", target: "60g", pct: 70, color: "#3B82F6" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl bg-white/70 px-3 py-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#6B5544]">{m.label}</span>
              <span className="font-semibold text-[#1F1611]">
                {m.val} <span className="text-[#9C8B7A]">/ {m.target}</span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F0E6DD]">
              <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MealPlanMock() {
  const meals = [
    { emoji: "🥪", name: "牛油果鸡蛋三明治", kcal: 420, color: "from-[#F59E0B] to-[#D97706]" },
    { emoji: "🥗", name: "香煎鸡胸肉藜麦碗", kcal: 580, color: "from-[#22C55E] to-[#15803D]" },
    { emoji: "🐟", name: "清蒸鲈鱼配西兰花", kcal: 520, color: "from-[#3B82F6] to-[#1E40AF]" },
    { emoji: "🥣", name: "希腊酸奶蓝莓碗", kcal: 180, color: "from-[#A855F7] to-[#7E22CE]" },
  ];

  return (
    <div>
      <div className="text-[10px] text-[#9C8B7A]">今日食谱</div>
      <div className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.04em] text-[#1F1611]">
        1850 <span className="text-[14px] font-medium tracking-normal text-[#9C8B7A]">kcal</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {meals.map((m, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[20px] border border-[#F0E6DD] bg-white/90 p-3 shadow-[0_8px_20px_rgba(125,92,69,0.05)]">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${m.color} text-lg shadow-inner`}>
              {m.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-[#FF6B35]">
                {["早餐 · 已完成", "午餐 · 进行中", "晚餐 · 18:30", "加餐 · 15:00"][i]}
              </div>
              <div className="truncate text-[15px] font-semibold text-[#1F1611]">{m.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-bold text-[#1F1611]">{m.kcal}</div>
              <div className="text-[10px] text-[#9C8B7A]">kcal</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroceryMock() {
  const categories = [
    { icon: "🥬", name: "蔬菜", items: ["西兰花 200g", "菠菜 150g", "番茄 300g"] },
    { icon: "🍗", name: "肉类", items: ["鸡胸肉 500g", "鲈鱼 1条"] },
    { icon: "🌾", name: "主食", items: ["藜麦 200g", "全麦面包 1袋"] },
  ];

  return (
    <div>
      <div className="text-[10px] text-[#9C8B7A]">灵感清单</div>
      <div className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.04em] text-[#1F1611]">
        今日 <span className="text-[14px] font-medium tracking-normal text-[#9C8B7A]">· ¥68</span>
      </div>
      <div className="mt-4 space-y-3">
        {categories.map((c) => (
          <div key={c.name} className="rounded-[20px] border border-[#F0E6DD] bg-white/88 p-3 shadow-[0_8px_20px_rgba(125,92,69,0.04)]">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#6B5544]">
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </div>
            <div className="mt-2 space-y-1.5 pl-1">
              {c.items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-[10px] text-[#6B5544]">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#E8DDD3] text-[8px] text-[#9C8B7A]">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-[20px] bg-[linear-gradient(135deg,#1F1611_0%,#3A2418_100%)] px-4 py-3 text-white shadow-[0_14px_26px_rgba(31,22,17,0.18)]">
          <div className="text-[10px] uppercase tracking-[0.12em] text-white/60">Quick order</div>
          <div className="mt-1 flex items-end justify-between">
            <div>
              <div className="text-[15px] font-semibold">一键下单食材包</div>
              <div className="text-[10px] text-white/70">20 分钟送达</div>
            </div>
            <div className="rounded-full bg-white/14 px-3 py-1 text-[10px] font-semibold">立即购买</div>
          </div>
        </div>
      </div>
    </div>
  );
}
