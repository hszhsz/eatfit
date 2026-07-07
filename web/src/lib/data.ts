import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ActivityLevel,
  CoachMessage,
  CoachResponse,
  CoachSession,
  DailyPlan,
  Goal,
  GroceryList,
  UserProfile,
  UserProfileFormValues,
} from "@/types/eatfit";

interface RawProfileRow {
  id: string;
  clerk_user_id: string;
  name: string;
  gender: "male" | "female";
  age: number;
  height_cm: number | string;
  weight_kg: number | string;
  body_fat_pct: number | string | null;
  activity_level: ActivityLevel;
  goal: Goal;
  allergens: string[] | null;
  disliked_tags: string[] | null;
  diet_preference: string | null;
  created_at: string;
  updated_at: string;
}

interface RawPlanSnapshot {
  id: string;
  profile_id: string;
  plan_date: string;
  target: unknown;
  meals: unknown;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
}

function mapProfile(row: RawProfileRow): UserProfile {
  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    name: row.name,
    gender: row.gender,
    age: row.age,
    heightCm: Number(row.height_cm),
    weightKg: Number(row.weight_kg),
    bodyFatPct: row.body_fat_pct ? Number(row.body_fat_pct) : null,
    activityLevel: row.activity_level,
    goal: row.goal,
    allergens: row.allergens || [],
    dislikedTags: row.disliked_tags || [],
    dietPreference: row.diet_preference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toProfileRow(clerkUserId: string, values: UserProfileFormValues) {
  return {
    clerk_user_id: clerkUserId,
    name: values.name,
    gender: values.gender,
    age: values.age,
    height_cm: values.heightCm,
    weight_kg: values.weightKg,
    body_fat_pct: values.bodyFatPct ?? null,
    activity_level: values.activityLevel,
    goal: values.goal,
    allergens: values.allergens,
    disliked_tags: values.dislikedTags,
    diet_preference: values.dietPreference ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function getCurrentProfile(
  client: SupabaseClient,
  clerkUserId: string,
) {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfile(data) : null;
}

export async function upsertProfile(
  client: SupabaseClient,
  clerkUserId: string,
  values: UserProfileFormValues,
) {
  const { data, error } = await client
    .from("profiles")
    .upsert([toProfileRow(clerkUserId, values)], {
      onConflict: "clerk_user_id",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapProfile(data);
}

export async function savePlanSnapshot(
  client: SupabaseClient,
  profileId: string,
  plan: DailyPlan,
) {
  const { error } = await client.from("daily_plan_snapshots").upsert(
    [
      {
        profile_id: profileId,
        plan_date: plan.date,
        target: plan.target,
        meals: plan.meals,
        total_calories: plan.totalCalories,
        total_protein_g: plan.totalProteinG,
        total_carbs_g: plan.totalCarbsG,
        total_fat_g: plan.totalFatG,
      },
    ],
    { onConflict: "profile_id,plan_date" },
  );

  if (error) {
    throw error;
  }
}

export async function getPlanSnapshot(
  client: SupabaseClient,
  profileId: string,
  date: string,
) {
  const { data, error } = await client
    .from("daily_plan_snapshots")
    .select("*")
    .eq("profile_id", profileId)
    .eq("plan_date", date)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as RawPlanSnapshot | null;
}

export async function saveGrocerySnapshot(
  client: SupabaseClient,
  profileId: string,
  grocery: GroceryList,
) {
  const { error } = await client.from("grocery_snapshots").upsert(
    [
      {
        profile_id: profileId,
        grocery_date: grocery.date,
        items: grocery.items,
        grouped_items: grocery.grouped,
      },
    ],
    { onConflict: "profile_id,grocery_date" },
  );

  if (error) {
    throw error;
  }
}

export async function listCoachSessions(
  client: SupabaseClient,
  profileId: string,
) {
  const { data, error } = await client
    .from("coach_sessions")
    .select("*")
    .eq("profile_id", profileId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(
    (row): CoachSession => ({
      id: row.id,
      profileId: row.profile_id,
      title: row.title,
      focus: row.focus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }),
  );
}

export async function listCoachMessages(
  client: SupabaseClient,
  sessionId: string,
) {
  const { data, error } = await client
    .from("coach_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(
    (row): CoachMessage => ({
      id: row.id,
      sessionId: row.session_id,
      role: row.role,
      message: row.message,
      structuredPayload: row.structured_payload as CoachResponse | null,
      createdAt: row.created_at,
    }),
  );
}

export async function createCoachExchange(
  client: SupabaseClient,
  profileId: string,
  title: string,
  focus: string,
  userMessage: string,
  response: CoachResponse,
) {
  const { data: session, error: sessionError } = await client
    .from("coach_sessions")
    .insert([
      {
        profile_id: profileId,
        title,
        focus,
        updated_at: new Date().toISOString(),
      },
    ])
    .select("*")
    .single();

  if (sessionError) {
    throw sessionError;
  }

  const { error: messageError } = await client.from("coach_messages").insert([
    {
      session_id: session.id,
      role: "user",
      message: userMessage,
    },
    {
      session_id: session.id,
      role: "assistant",
      message: response.summary,
      structured_payload: response,
    },
  ]);

  if (messageError) {
    throw messageError;
  }

  return session.id as string;
}
