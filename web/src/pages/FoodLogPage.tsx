import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useLang } from "@/i18n/LanguageContext";

export function FoodLogPage() {
  const { data: profile } = useCurrentProfile();
  const { lang } = useLang();

  if (!profile) {
    return (
      <EmptyState
        title={lang === "zh" ? "先设置档案" : "Set up your profile first"}
        body={lang === "zh" ? "需要先创建营养档案才能记录饮食。" : "Create a nutrition profile before logging food."}
        cta={lang === "zh" ? "设置档案" : "Set Up Profile"}
        to="/app/profile"
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title={lang === "zh" ? "饮食记录" : "Food Log"}
        eyebrow={lang === "zh" ? "即将推出" : "Coming soon"}
      >
        <div className="py-8 text-center text-[#6B5544]">
          {lang === "zh"
            ? "饮食记录功能正在迁移到新架构，稍后恢复。"
            : "Food logging is being migrated to the new architecture. Check back soon."}
        </div>
      </SectionCard>
    </div>
  );
}
