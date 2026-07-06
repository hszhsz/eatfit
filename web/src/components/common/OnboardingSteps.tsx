import { useLang } from "@/i18n/LanguageContext";

interface OnboardingStepsProps {
  hasProfile: boolean;
  hasPlan: boolean;
  hasCoach: boolean;
}

export function OnboardingSteps({ hasProfile, hasPlan, hasCoach }: OnboardingStepsProps) {
  const { lang } = useLang();

  const steps = [
    {
      done: hasProfile,
      label: lang === "zh" ? "填写体测数据" : "Set up your profile",
      desc: lang === "zh" ? "录入身高体重、目标和偏好" : "Enter body metrics, goal and preferences",
      icon: "📋",
    },
    {
      done: hasPlan,
      label: lang === "zh" ? "生成今日计划" : "Generate today's plan",
      desc: lang === "zh" ? "AI 根据你的数据生成三餐方案" : "AI creates your meal plan from your data",
      icon: "🍽️",
    },
    {
      done: hasCoach,
      label: lang === "zh" ? "咨询 AI 顾问" : "Ask the AI Coach",
      desc: lang === "zh" ? "获取个性化饮食建议和行动指导" : "Get personalized advice and next actions",
      icon: "🤖",
    },
  ];

  const allDone = steps.every((s) => s.done);
  if (allDone) return null;

  return (
    <div className="rounded-[24px] border border-[#FF6B35]/20 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,53,0.06),_transparent_40%),rgba(255,255,255,0.8)] p-6 shadow-warm">
      <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
        {lang === "zh" ? "快速上手" : "Quick Start"}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`rounded-2xl border p-4 transition ${
              step.done
                ? "border-[#FF6B35]/30 bg-[#FFE5D9] opacity-70"
                : "border-[#F0E6DD] bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{step.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#1F1611]">{step.label}</span>
                  {step.done && <span className="text-[#FF6B35]">✓</span>}
                </div>
                <div className="mt-1 text-xs text-[#6B5544]">{step.desc}</div>
              </div>
            </div>
            {!step.done && (
              <div className="mt-2 text-xs font-medium text-[#FF6B35]">
                {lang === "zh" ? "待完成" : "Pending"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
