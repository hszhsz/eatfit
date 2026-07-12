/**
 * Authenticated API client for the EatFit backend.
 *
 * All persistent-data endpoints go through the backend (which uses
 * Supabase service_role), so the frontend never talks to Supabase directly.
 * Auth: Clerk JWT passed as Authorization: Bearer <token>.
 */
import { env } from "@/lib/env";

const BASE = env.apiBaseUrl;

export interface ProfileData {
  name: string;
  gender: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number | null;
  activityLevel: string;
  goal: string;
  allergens: string[];
  dislikedTags: string[];
  dietPreference?: string | null;
}

export interface ProfileResponse {
  id: string;
  clerk_user_id: string;
  name: string;
  gender: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  body_fat_pct: number | null;
  activity_level: string;
  goal: string;
  allergens: string[];
  disliked_tags: string[];
  diet_preference: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiClient {
  getProfile(): Promise<ProfileResponse | null>;
  upsertProfile(data: ProfileData): Promise<ProfileResponse>;
  deleteProfile(): Promise<void>;
  getToken(): Promise<string | null>;
}

async function authFetch(
  getToken: () => Promise<string | null>,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await getToken();
  if (!token) {
    throw new Error("No Clerk session token available. Please sign in again.");
  }
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `API error: ${res.status}`);
  }
  return res;
}

export function createApiClient(
  getToken: () => Promise<string | null>,
): ApiClient {
  return {
    async getToken() {
      return getToken();
    },

    async getProfile() {
      const res = await authFetch(getToken, "/api/data/profile");
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text) as ProfileResponse;
    },

    async upsertProfile(data: ProfileData) {
      const res = await authFetch(getToken, "/api/data/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: data.name,
          gender: data.gender,
          age: data.age,
          height_cm: data.heightCm,
          weight_kg: data.weightKg,
          body_fat_pct: data.bodyFatPct ?? null,
          activity_level: data.activityLevel,
          goal: data.goal,
          allergens: data.allergens,
          disliked_tags: data.dislikedTags,
          diet_preference: data.dietPreference ?? null,
        }),
      });
      return (await res.json()) as ProfileResponse;
    },

    async deleteProfile() {
      await authFetch(getToken, "/api/data/profile", { method: "DELETE" });
    },
  };
}
