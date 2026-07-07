import { env } from "@/lib/env";
import type {
  CoachRequest,
  CoachResponse,
  DailyPlan,
  GroceryList,
  Recipe,
  UserProfileFormValues,
} from "@/types/eatfit";

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

function mapRecipe(recipe: any): Recipe {
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
    ingredients: recipe.ingredients.map((item: any) => ({
      name: item.name,
      amountG: item.amount_g,
      category: item.category,
    })),
    steps: recipe.steps,
    imageEmoji: recipe.image_emoji,
    imageUrl: recipe.image_url ?? null,
  };
}

function mapPlan(plan: any): DailyPlan {
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
    meals: plan.meals.map((meal: any) => ({
      mealType: meal.meal_type,
      recipe: mapRecipe(meal.recipe),
    })),
    totalCalories: plan.total_calories,
    totalProteinG: plan.total_protein_g,
    totalCarbsG: plan.total_carbs_g,
    totalFatG: plan.total_fat_g,
  };
}

function mapGrocery(list: any): GroceryList {
  return {
    date: list.date,
    profileId: list.profile_id,
    items: list.items.map((item: any) => ({
      name: item.name,
      totalAmountG: item.total_amount_g,
      category: item.category,
    })),
    grouped: Object.fromEntries(
      Object.entries(list.grouped).map(([key, value]) => [
        key,
        (value as any[]).map((item) => ({
          name: item.name,
          totalAmountG: item.total_amount_g,
          category: item.category,
        })),
      ]),
    ),
  };
}

function mapCoach(response: any): CoachResponse {
  return {
    focus: response.focus,
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
  const recipes = await request<any[]>("/api/recipes");
  return recipes.map(mapRecipe);
}

// ---------- Plan/Grocery/Coach: prefer by-id (Supabase), fallback to full profile ----------

export async function fetchPlan(profile: UserProfileFormValues, date: string, profileId?: string) {
  if (profileId) {
    const payload = await request<any>("/api/web/by-id/plan", {
      method: "POST",
      body: JSON.stringify({ profile_id: profileId, date }),
    });
    return mapPlan(payload);
  }
  const payload = await request<any>("/api/web/plan", {
    method: "POST",
    body: JSON.stringify({ profile: toProfilePayload(profile), date }),
  });
  return mapPlan(payload);
}

export async function fetchGrocery(profile: UserProfileFormValues, date: string, profileId?: string) {
  if (profileId) {
    const payload = await request<any>("/api/web/by-id/grocery", {
      method: "POST",
      body: JSON.stringify({ profile_id: profileId, date }),
    });
    return mapGrocery(payload);
  }
  const payload = await request<any>("/api/web/grocery", {
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
    const payload = await request<any>("/api/web/by-id/coach/advice", {
      method: "POST",
      body: JSON.stringify({
        profile_id: profileId,
        request: coachRequest,
        date,
      }),
    });
    return mapCoach(payload);
  }
  const payload = await request<any>("/api/web/coach/advice", {
    method: "POST",
    body: JSON.stringify({
      profile: toProfilePayload(profile),
      date,
      request: coachRequest,
    }),
  });
  return mapCoach(payload);
}
