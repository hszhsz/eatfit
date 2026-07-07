export type Goal = "lose_fat" | "maintain" | "gain_muscle";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type CoachFocus =
  | "daily_review"
  | "meal_strategy"
  | "eating_out"
  | "cravings";

export interface UserProfileFormValues {
  name: string;
  gender: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number | null;
  activityLevel: ActivityLevel;
  goal: Goal;
  allergens: string[];
  dislikedTags: string[];
  dietPreference?: string | null;
}

export interface UserProfile extends UserProfileFormValues {
  id: string;
  clerkUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionTarget {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  explanation: string;
}

export interface IngredientItem {
  name: string;
  amountG: number;
  category: string;
}

export interface Recipe {
  id: number;
  name: string;
  mealType: MealType;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  tags: string[];
  allergens: string[];
  cookMinutes: number;
  ingredients: IngredientItem[];
  steps: string[];
  imageEmoji: string;
  imageUrl?: string | null;
}

export interface MealItem {
  mealType: MealType;
  recipe: Recipe;
}

export interface DailyPlan {
  date: string;
  profileId: number;
  target: NutritionTarget;
  meals: MealItem[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
}

export interface GroceryItem {
  name: string;
  totalAmountG: number;
  category: string;
}

export interface GroceryList {
  date: string;
  profileId: number;
  items: GroceryItem[];
  grouped: Record<string, GroceryItem[]>;
}

export interface CoachRequest {
  focus: CoachFocus;
  message?: string;
}

export interface CoachResponse {
  focus: CoachFocus;
  headline: string;
  summary: string;
  score: number;
  riskAlerts: string[];
  nutritionInsights: string[];
  nextActions: string[];
  mealStrategy: string[];
  disclaimer: string;
}

export interface CoachSession {
  id: string;
  profileId: string;
  title: string;
  focus: CoachFocus;
  createdAt: string;
  updatedAt: string;
}

export interface CoachMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  message: string;
  structuredPayload?: CoachResponse | null;
  createdAt: string;
}

export interface FoodLog {
  id: string;
  profileId: string;
  logDate: string;
  mealType: MealType;
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
