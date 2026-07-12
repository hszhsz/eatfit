import { env } from "@/lib/env";
import type {
  CoachChatResponse,
  CoachRequest,
  CoachResponse,
  CoachSession,
  CoachMessage,
  DailyPlan,
  GroceryList,
  MealType,
  Recipe,
  UserProfileFormValues,
} from "@/types/eatfit";

// ---------- Raw API response types (snake_case from backend) ----------

interface RawIngredient {
  name: string;
  amount_g: number;
  category: string;
}

interface RawRecipe {
  id: number;
  name: string;
  meal_type: MealType;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  tags: string[];
  allergens: string[];
  cook_minutes: number;
  ingredients: RawIngredient[];
  steps: string[];
  image_emoji: string;
  image_url?: string | null;
}

interface RawNutritionTarget {
  bmr: number;
  tdee: number;
  target_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  explanation: string;
}

interface RawMeal {
  meal_type: MealType;
  recipe: RawRecipe;
}

interface RawPlan {
  date: string;
  profile_id: number;
  target: RawNutritionTarget;
  meals: RawMeal[];
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
}

interface RawGroceryItem {
  name: string;
  total_amount_g: number;
  category: string;
}

interface RawGrocery {
  date: string;
  profile_id: number;
  items: RawGroceryItem[];
  grouped: Record<string, RawGroceryItem[]>;
}

interface RawCoachResponse {
  focus: string;
  headline: string;
  summary: string;
  score: number;
  risk_alerts: string[];
  nutrition_insights: string[];
  next_actions: string[];
  meal_strategy: string[];
  disclaimer: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function toProfilePayload(profile: UserProfileFormValues) {
  return {
    name: profile.name,
    gender: profile.gender,
    age: profile.age,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    body_fat_pct: profile.bodyFatPct ?? null,
    activity_level: profile.activityLevel,
    goal: profile.goal,
    allergens: profile.allergens,
    disliked_tags: profile.dislikedTags,
    diet_preference: profile.dietPreference ?? null,
  };
}

function mapRecipe(recipe: RawRecipe): Recipe {
  return {
    id: recipe.id,
    name: recipe.name,
    mealType: recipe.meal_type,
    calories: recipe.calories,
    proteinG: recipe.protein_g,
    carbsG: recipe.carbs_g,
    fatG: recipe.fat_g,
    tags: recipe.tags,
    allergens: recipe.allergens,
    cookMinutes: recipe.cook_minutes,
    ingredients: recipe.ingredients.map((item: RawIngredient) => ({
      name: item.name,
      amountG: item.amount_g,
      category: item.category,
    })),
    steps: recipe.steps,
    imageEmoji: recipe.image_emoji,
    imageUrl: recipe.image_url ?? null,
  };
}

function mapPlan(plan: RawPlan): DailyPlan {
  return {
    date: plan.date,
    profileId: plan.profile_id,
    target: {
      bmr: plan.target.bmr,
      tdee: plan.target.tdee,
      targetCalories: plan.target.target_calories,
      proteinG: plan.target.protein_g,
      carbsG: plan.target.carbs_g,
      fatG: plan.target.fat_g,
      explanation: plan.target.explanation,
    },
    meals: plan.meals.map((meal: RawMeal) => ({
      mealType: meal.meal_type,
      recipe: mapRecipe(meal.recipe),
    })),
    totalCalories: plan.total_calories,
    totalProteinG: plan.total_protein_g,
    totalCarbsG: plan.total_carbs_g,
    totalFatG: plan.total_fat_g,
  };
}

function mapGrocery(list: RawGrocery): GroceryList {
  return {
    date: list.date,
    profileId: list.profile_id,
    items: list.items.map((item: RawGroceryItem) => ({
      name: item.name,
      totalAmountG: item.total_amount_g,
      category: item.category,
    })),
    grouped: Object.fromEntries(
      Object.entries(list.grouped).map(([key, value]) => [
        key,
        (value as RawGroceryItem[]).map((item) => ({
          name: item.name,
          totalAmountG: item.total_amount_g,
          category: item.category,
        })),
      ]),
    ),
  };
}

function mapCoach(response: RawCoachResponse): CoachResponse {
  return {
    focus: response.focus as CoachResponse["focus"],
    headline: response.headline,
    summary: response.summary,
    score: response.score,
    riskAlerts: response.risk_alerts,
    nutritionInsights: response.nutrition_insights,
    nextActions: response.next_actions,
    mealStrategy: response.meal_strategy,
    disclaimer: response.disclaimer,
  };
}

// ---------- Recipe API ----------

export async function fetchRecipes() {
  const recipes = await request<RawRecipe[]>("/api/recipes");
  return recipes.map(mapRecipe);
}

// ---------- Plan/Grocery/Coach: prefer by-id (Supabase), fallback to full profile ----------

export async function fetchPlan(profile: UserProfileFormValues, date: string, profileId?: string) {
  if (profileId) {
    const payload = await request<RawPlan>("/api/web/by-id/plan", {
      method: "POST",
      body: JSON.stringify({ profile_id: profileId, date }),
    });
    return mapPlan(payload);
  }
  const payload = await request<RawPlan>("/api/web/plan", {
    method: "POST",
    body: JSON.stringify({ profile: toProfilePayload(profile), date }),
  });
  return mapPlan(payload);
}

export async function fetchGrocery(profile: UserProfileFormValues, date: string, profileId?: string) {
  if (profileId) {
    const payload = await request<RawGrocery>("/api/web/by-id/grocery", {
      method: "POST",
      body: JSON.stringify({ profile_id: profileId, date }),
    });
    return mapGrocery(payload);
  }
  const payload = await request<RawGrocery>("/api/web/grocery", {
    method: "POST",
    body: JSON.stringify({ profile: toProfilePayload(profile), date }),
  });
  return mapGrocery(payload);
}

export async function fetchCoachAdvice(
  profile: UserProfileFormValues,
  date: string,
  coachRequest: CoachRequest,
  profileId?: string,
) {
  if (profileId) {
    const payload = await request<RawCoachResponse>("/api/web/by-id/coach/advice", {
      method: "POST",
      body: JSON.stringify({
        profile_id: profileId,
        request: coachRequest,
        date,
      }),
    });
    return mapCoach(payload);
  }
  const payload = await request<RawCoachResponse>("/api/web/coach/advice", {
    method: "POST",
    body: JSON.stringify({
      profile: toProfilePayload(profile),
      date,
      request: coachRequest,
    }),
  });
  return mapCoach(payload);
}

// ---------- Coach Chat API ----------

interface RawCoachChatResponse {
  session_id: string;
  session_title: string;
  user_message_id: string;
  assistant_message_id: string;
  response: RawCoachResponse;
}

interface RawCoachSession {
  id: string;
  profile_id: string;
  title: string;
  focus: string;
  created_at: string;
  updated_at: string;
}

interface RawCoachMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  message: string;
  structured_payload: RawCoachResponse | null;
  created_at: string;
}

function mapCoachSession(raw: RawCoachSession): CoachSession {
  return {
    id: raw.id,
    profileId: raw.profile_id,
    title: raw.title,
    focus: raw.focus as CoachSession["focus"],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapCoachMessage(raw: RawCoachMessage): CoachMessage {
  return {
    id: raw.id,
    sessionId: raw.session_id,
    role: raw.role,
    message: raw.message,
    structuredPayload: raw.structured_payload
      ? mapCoach(raw.structured_payload)
      : null,
    createdAt: raw.created_at,
  };
}

export async function sendCoachChatMessage(
  profileId: string,
  message: string,
  sessionId?: string,
  date?: string,
): Promise<CoachChatResponse & { response: CoachResponse }> {
  const raw = await request<RawCoachChatResponse>("/api/web/by-id/coach/chat", {
    method: "POST",
    body: JSON.stringify({
      profile_id: profileId,
      message,
      session_id: sessionId || undefined,
      date: date || undefined,
    }),
  });
  return {
    sessionId: raw.session_id,
    sessionTitle: raw.session_title,
    userMessageId: raw.user_message_id,
    assistantMessageId: raw.assistant_message_id,
    response: mapCoach(raw.response),
  };
}

export async function fetchCoachSessions(profileId: string): Promise<CoachSession[]> {
  const data = await request<RawCoachSession[]>(
    `/api/web/by-id/coach/sessions?profile_id=${encodeURIComponent(profileId)}`,
  );
  return data.map(mapCoachSession);
}

export async function fetchCoachMessages(sessionId: string): Promise<CoachMessage[]> {
  const data = await request<RawCoachMessage[]>(
    `/api/web/by-id/coach/sessions/${encodeURIComponent(sessionId)}/messages`,
  );
  return data.map(mapCoachMessage);
}
