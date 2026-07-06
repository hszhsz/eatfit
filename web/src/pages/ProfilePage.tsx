import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { getActivityLabels, getGoalLabels, joinTags, splitTags } from "@/lib/format";
import type { UserProfileFormValues } from "@/types/eatfit";
import { useLang } from "@/i18n/LanguageContext";

const profileSchema = z.object({
  name: z.string().min(2),
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().min(10).max(100),
  heightCm: z.coerce.number().min(100).max(250),
  weightKg: z.coerce.number().min(30).max(250),
  bodyFatPct: z
    .union([z.literal(""), z.coerce.number().min(3).max(60)])
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["lose_fat", "maintain", "gain_muscle"]),
  dietPreference: z.string().optional().nullable(),
  allergensText: z.string().default(""),
  dislikedTagsText: z.string().default(""),
});

type ProfileFormSchema = z.infer<typeof profileSchema>;

const defaultValues: ProfileFormSchema = {
  name: "",
  gender: "male",
  age: 28,
  heightCm: 175,
  weightKg: 72,
  bodyFatPct: null,
  activityLevel: "moderate",
  goal: "maintain",
  dietPreference: "",
  allergensText: "",
  dislikedTagsText: "",
};

export function ProfilePage() {
  const { data: profile, saveProfile, isSaving, saveError } = useCurrentProfile();
  const { lang, t } = useLang();
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    form.reset({
      name: profile.name,
      gender: profile.gender,
      age: profile.age,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      bodyFatPct: profile.bodyFatPct ?? null,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      dietPreference: profile.dietPreference ?? "",
      allergensText: joinTags(profile.allergens),
      dislikedTagsText: joinTags(profile.dislikedTags),
    });
  }, [form, profile]);

  async function onSubmit(values: ProfileFormSchema) {
    const payload: UserProfileFormValues = {
      name: values.name,
      gender: values.gender,
      age: values.age,
      heightCm: values.heightCm,
      weightKg: values.weightKg,
      bodyFatPct: values.bodyFatPct ?? null,
      activityLevel: values.activityLevel,
      goal: values.goal,
      allergens: splitTags(values.allergensText),
      dislikedTags: splitTags(values.dislikedTagsText),
      dietPreference: values.dietPreference || null,
    };

    await saveProfile(payload);
  }

  const goalLabels = getGoalLabels(lang);
  const activityLabels = getActivityLabels(lang);

  return (
    <div className="space-y-6">
      <SectionCard title={t("profile.title")} eyebrow={t("profile.eyebrow")}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["name", t("profile.name"), "text"],
              ["age", t("profile.age"), "number"],
              ["heightCm", t("profile.height"), "number"],
              ["weightKg", t("profile.weight"), "number"],
              ["bodyFatPct", t("profile.bodyFat"), "number"],
            ].map(([field, label, type]) => (
              <label key={field} className="block">
                <div className="mb-2 text-sm text-[#6B5544]">{label}</div>
                <input
                  type={type}
                  {...form.register(field as keyof ProfileFormSchema)}
                  className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none transition focus:border-[#FF6B35]/40"
                />
              </label>
            ))}

            <label className="block">
              <div className="mb-2 text-sm text-[#6B5544]">{t("profile.gender")}</div>
              <select
                {...form.register("gender")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none"
              >
                <option value="male">{t("profile.male")}</option>
                <option value="female">{t("profile.female")}</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-2 text-sm text-[#6B5544]">{t("profile.goal")}</div>
              <select
                {...form.register("goal")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none"
              >
                {Object.entries(goalLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="mb-2 text-sm text-[#6B5544]">{t("profile.activity")}</div>
              <select
                {...form.register("activityLevel")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none"
              >
                {Object.entries(activityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block xl:col-span-3">
              <div className="mb-2 text-sm text-[#6B5544]">{t("profile.diet")}</div>
              <input
                type="text"
                placeholder={t("profile.dietPlaceholder")}
                {...form.register("dietPreference")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none transition focus:border-[#FF6B35]/40"
              />
            </label>

            <label className="block xl:col-span-3">
              <div className="mb-2 text-sm text-[#6B5544]">{t("profile.allergens")}</div>
              <input
                type="text"
                placeholder={t("profile.allergensPlaceholder")}
                {...form.register("allergensText")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none transition focus:border-[#FF6B35]/40"
              />
            </label>

            <label className="block xl:col-span-3">
              <div className="mb-2 text-sm text-[#6B5544]">{t("profile.disliked")}</div>
              <input
                type="text"
                placeholder={t("profile.dislikedPlaceholder")}
                {...form.register("dislikedTagsText")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none transition focus:border-[#FF6B35]/40"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 transition hover:bg-[#E55329]"
            >
              {isSaving ? t("profile.saving") : t("profile.save")}
            </button>
            {saveError ? (
              <div className="text-sm text-red-500">{String(saveError.message)}</div>
            ) : profile ? (
              <div className="text-sm text-[#6B5544]">
                {t("profile.lastUpdated", { date: new Date(profile.updatedAt).toLocaleString() })}
              </div>
            ) : (
              <div className="text-sm text-[#6B5544]">
                {t("profile.createHint")}
              </div>
            )}
          </div>
        </form>
      </SectionCard>

      {!profile ? (
        <EmptyState
          title={t("profile.noProfileTitle")}
          body={t("profile.noProfileBody")}
        />
      ) : null}
    </div>
  );
}
