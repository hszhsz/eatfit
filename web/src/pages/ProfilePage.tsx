import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { activityLabels, goalLabels, joinTags, splitTags } from "@/lib/format";
import type { UserProfileFormValues } from "@/types/eatfit";

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

  return (
    <div className="space-y-6">
      <SectionCard title="Nutrition profile" eyebrow="Supabase">
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["name", "Name", "text"],
              ["age", "Age", "number"],
              ["heightCm", "Height (cm)", "number"],
              ["weightKg", "Weight (kg)", "number"],
              ["bodyFatPct", "Body fat %", "number"],
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
              <div className="mb-2 text-sm text-[#6B5544]">Gender</div>
              <select
                {...form.register("gender")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-2 text-sm text-[#6B5544]">Goal</div>
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
              <div className="mb-2 text-sm text-[#6B5544]">Activity level</div>
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
              <div className="mb-2 text-sm text-[#6B5544]">Diet preference</div>
              <input
                type="text"
                placeholder="vegetarian, high-protein, etc."
                {...form.register("dietPreference")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none transition focus:border-[#FF6B35]/40"
              />
            </label>

            <label className="block xl:col-span-3">
              <div className="mb-2 text-sm text-[#6B5544]">Allergens (comma separated)</div>
              <input
                type="text"
                placeholder="shrimp, peanut"
                {...form.register("allergensText")}
                className="w-full rounded-2xl border border-[#F0E6DD] bg-white px-4 py-3 text-[#1F1611] outline-none transition focus:border-[#FF6B35]/40"
              />
            </label>

            <label className="block xl:col-span-3">
              <div className="mb-2 text-sm text-[#6B5544]">Disliked tags (comma separated)</div>
              <input
                type="text"
                placeholder="fish, spicy"
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
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
            {saveError ? (
              <div className="text-sm text-red-500">{String(saveError.message)}</div>
            ) : profile ? (
              <div className="text-sm text-[#6B5544]">
                Last updated {new Date(profile.updatedAt).toLocaleString()}
              </div>
            ) : (
              <div className="text-sm text-[#6B5544]">
                Create the profile once and EatFit will persist it to Supabase.
              </div>
            )}
          </div>
        </form>
      </SectionCard>

      {!profile ? (
        <EmptyState
          title="No profile row yet"
          body="Once you save the form above, the dashboard will start generating targets, plans, grocery output, and AI coach sessions."
        />
      ) : null}
    </div>
  );
}
