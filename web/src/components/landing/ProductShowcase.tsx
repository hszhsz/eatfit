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
            {/* Phone mockup */}
            <div className="w-full max-w-[240px] rounded-[32px] border-[3px] border-[#1F1611] bg-[#1F1611] p-2.5 shadow-[0_20px_50px_rgba(255,107,53,0.10)]">
              <div className="overflow-hidden rounded-[22px] bg-[#FFF9F2]">
                {screen.content}
              </div>
            </div>
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

/* --- Mock screens --- */

function DashboardMock() {
  return (
    <div className="p-3">
      <div className="text-[9px] text-[#9C8B7A]">今日面板</div>
      <div className="mt-1 font-serif text-sm text-[#1F1611]">营养总览</div>

      {/* Calorie ring */}
      <div className="mt-3 flex items-center justify-center">
        <div className="relative h-20 w-20">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" stroke="#F0E6DD" strokeWidth="6" fill="none" />
            <circle
              cx="40" cy="40" r="34"
              stroke="#FF6B35" strokeWidth="6" fill="none"
              strokeDasharray="213.6" strokeDashoffset="81" strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-sm font-bold text-[#FF6B35]">62%</div>
            <div className="text-[8px] text-[#9C8B7A]">完成</div>
          </div>
        </div>
      </div>

      {/* Macro bars */}
      <div className="mt-3 space-y-2">
        {[
          { label: "蛋白质", val: "123g", target: "150g", pct: 82, color: "#FF6B35" },
          { label: "碳水", val: "145g", target: "200g", pct: 72, color: "#7CB342" },
          { label: "脂肪", val: "42g", target: "60g", pct: 70, color: "#3B82F6" },
        ].map((m) => (
          <div key={m.label}>
            <div className="flex justify-between text-[9px]">
              <span className="text-[#6B5544]">{m.label}</span>
              <span className="font-semibold text-[#1F1611]">{m.val} <span className="text-[#9C8B7A]">/ {m.target}</span></span>
            </div>
            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-[#F0E6DD]">
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
    <div className="p-3">
      <div className="text-[9px] text-[#9C8B7A]">今日食谱</div>
      <div className="mt-1 font-serif text-sm text-[#1F1611]">1850 kcal</div>
      <div className="mt-2 space-y-1.5">
        {meals.map((m, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-[#F0E6DD] bg-white p-1.5">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${m.color} text-xs`}>
              {m.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[9px] font-semibold text-[#1F1611]">{m.name}</div>
            </div>
            <div className="text-[9px] font-bold text-[#1F1611]">{m.kcal}</div>
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
    <div className="p-3">
      <div className="text-[9px] text-[#9C8B7A]">买菜清单</div>
      <div className="mt-1 font-serif text-sm text-[#1F1611]">今日 · ¥68</div>
      <div className="mt-2 space-y-2">
        {categories.map((c) => (
          <div key={c.name}>
            <div className="flex items-center gap-1 text-[9px] font-semibold text-[#6B5544]">
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </div>
            <div className="mt-0.5 space-y-0.5 pl-4">
              {c.items.map((item) => (
                <div key={item} className="flex items-center gap-1 text-[8px] text-[#6B5544]">
                  <span className="text-[#9C8B7A]">○</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
