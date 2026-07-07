import type { SupabaseClient } from "@supabase/supabase-js";

export interface FoodLog {
  id: string;
  profileId: string;
  logDate: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  source: string;
  recipeId: number | null;
  createdAt: string;
}

export interface WeightLog {
  id: string;
  profileId: string;
  logDate: string;
  weightKg: number;
  note: string | null;
  createdAt: string;
}

interface RawFoodLogRow {
  id: string;
  profile_id: string;
  log_date: string;
  meal_type: FoodLog["mealType"];
  food_name: string;
  calories: number | string;
  protein_g: number | string;
  carbs_g: number | string;
  fat_g: number | string;
  source: string | null;
  recipe_id: number | null;
  created_at: string;
}

interface RawWeightLogRow {
  id: string;
  profile_id: string;
  log_date: string;
  weight_kg: number | string;
  note: string | null;
  created_at: string;
}

function mapFoodLog(row: RawFoodLogRow): FoodLog {
  return {
    id: row.id,
    profileId: row.profile_id,
    logDate: row.log_date,
    mealType: row.meal_type,
    foodName: row.food_name,
    calories: Number(row.calories),
    proteinG: Number(row.protein_g),
    carbsG: Number(row.carbs_g),
    fatG: Number(row.fat_g),
    source: row.source || "manual",
    recipeId: row.recipe_id ?? null,
    createdAt: row.created_at,
  };
}

function mapWeightLog(row: RawWeightLogRow): WeightLog {
  return {
    id: row.id,
    profileId: row.profile_id,
    logDate: row.log_date,
    weightKg: Number(row.weight_kg),
    note: row.note,
    createdAt: row.created_at,
  };
}

// ---------- Food Logs ----------

export async function fetchFoodLogs(
  client: SupabaseClient,
  profileId: string,
  date: string,
): Promise<FoodLog[]> {
  const { data, error } = await client
    .from("food_logs")
    .select("*")
    .eq("profile_id", profileId)
    .eq("log_date", date)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapFoodLog);
}

export async function addFoodLog(
  client: SupabaseClient,
  profileId: string,
  entry: {
    logDate: string;
    mealType: string;
    foodName: string;
    calories: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
    source?: string;
    recipeId?: number | null;
  },
): Promise<FoodLog> {
  const { data, error } = await client
    .from("food_logs")
    .insert([{
      profile_id: profileId,
      log_date: entry.logDate,
      meal_type: entry.mealType,
      food_name: entry.foodName,
      calories: entry.calories,
      protein_g: entry.proteinG ?? 0,
      carbs_g: entry.carbsG ?? 0,
      fat_g: entry.fatG ?? 0,
      source: entry.source ?? "manual",
      recipe_id: entry.recipeId ?? null,
    }])
    .select("*")
    .single();

  if (error) throw error;
  return mapFoodLog(data);
}

export async function deleteFoodLog(
  client: SupabaseClient,
  logId: string,
): Promise<void> {
  const { error } = await client.from("food_logs").delete().eq("id", logId);
  if (error) throw error;
}

// ---------- Weight Logs ----------

export async function fetchWeightLogs(
  client: SupabaseClient,
  profileId: string,
  limit: number = 30,
): Promise<WeightLog[]> {
  const { data, error } = await client
    .from("weight_logs")
    .select("*")
    .eq("profile_id", profileId)
    .order("log_date", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapWeightLog);
}

export async function upsertWeightLog(
  client: SupabaseClient,
  profileId: string,
  date: string,
  weightKg: number,
  note?: string,
): Promise<WeightLog> {
  const { data, error } = await client
    .from("weight_logs")
    .upsert([{
      profile_id: profileId,
      log_date: date,
      weight_kg: weightKg,
      note: note ?? null,
    }], { onConflict: "profile_id,log_date" })
    .select("*")
    .single();

  if (error) throw error;
  return mapWeightLog(data);
}
