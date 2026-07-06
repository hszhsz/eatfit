"""Supabase REST API client for the EatFit backend.

Uses the service_role key to bypass RLS — this is safe because
only the backend has access to this key. The frontend uses the
anon key with Clerk JWT for RLS-protected access.

Environment variables:
  SUPABASE_URL: e.g. https://vdllydxlrhuvulkgtzhe.supabase.co
  SUPABASE_SERVICE_KEY: service_role key (secret!)
"""
from __future__ import annotations

import json
import os
from typing import Any

import httpx

from app.data.recipes_seed import RECIPES
from app.schemas import IngredientItem, MealType, RecipeOut


class SupabaseClient:
    """Thin wrapper around Supabase REST API (PostgREST)."""

    def __init__(self) -> None:
        self.url = os.getenv("SUPABASE_URL", "").rstrip("/")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY", "")
        self._headers = {
            "apikey": self.service_key,
            "Authorization": f"Bearer {self.service_key}",
            "Content-Type": "application/json",
        }

    @property
    def available(self) -> bool:
        return bool(self.url and self.service_key)

    # ---------- Recipes ----------

    def fetch_recipes(self) -> list[RecipeOut]:
        """Fetch all recipes from Supabase. Returns empty list if table is empty or unavailable."""
        if not self.available:
            return []
        try:
            resp = httpx.get(
                f"{self.url}/rest/v1/recipes?select=*",
                headers=self._headers,
                timeout=10.0,
            )
            resp.raise_for_status()
            rows = resp.json()
            return [self._row_to_recipe(r) for r in rows]
        except Exception:
            return []

    def seed_recipes_if_empty(self) -> int:
        """Insert seed recipes if the table is empty. Returns total count after seeding."""
        if not self.available:
            return 0
        existing = self.fetch_recipes()
        if existing:
            return len(existing)
        # Insert seed data
        payload = []
        for i, r in enumerate(RECIPES, 1):
            payload.append({
                "id": i,
                "name": r["name"],
                "meal_type": r["meal_type"],
                "calories": r["calories"],
                "protein_g": r["protein_g"],
                "carbs_g": r["carbs_g"],
                "fat_g": r["fat_g"],
                "tags": json.dumps(r["tags"]),
                "allergens": json.dumps(r["allergens"]),
                "cook_minutes": r["cook_minutes"],
                "ingredients": json.dumps(r["ingredients"]),
                "steps": json.dumps(r["steps"]),
                "image_emoji": r.get("image_emoji", "🍽️"),
            })
        try:
            resp = httpx.post(
                f"{self.url}/rest/v1/recipes",
                headers={**self._headers, "Prefer": "return=representation"},
                json=payload,
                timeout=30.0,
            )
            resp.raise_for_status()
            return len(resp.json())
        except Exception:
            return 0

    def _row_to_recipe(self, row: dict[str, Any]) -> RecipeOut:
        tags = row.get("tags", [])
        if isinstance(tags, str):
            tags = json.loads(tags)
        allergens = row.get("allergens", [])
        if isinstance(allergens, str):
            allergens = json.loads(allergens)
        ingredients = row.get("ingredients", [])
        if isinstance(ingredients, str):
            ingredients = json.loads(ingredients)
        steps = row.get("steps", [])
        if isinstance(steps, str):
            steps = json.loads(steps)
        return RecipeOut(
            id=row["id"],
            name=row["name"],
            meal_type=MealType(row["meal_type"]),
            calories=float(row["calories"]),
            protein_g=float(row["protein_g"]),
            carbs_g=float(row["carbs_g"]),
            fat_g=float(row["fat_g"]),
            tags=tags,
            allergens=allergens,
            cook_minutes=int(row["cook_minutes"]),
            ingredients=[IngredientItem(**i) for i in ingredients],
            steps=steps,
            image_emoji=row.get("image_emoji", "🍽️"),
        )

    # ---------- Profiles ----------

    def fetch_profile(self, profile_id: str) -> dict | None:
        """Fetch a profile by UUID. Returns None if not found."""
        if not self.available:
            return None
        try:
            resp = httpx.get(
                f"{self.url}/rest/v1/profiles?id=eq.{profile_id}&select=*",
                headers=self._headers,
                timeout=10.0,
            )
            resp.raise_for_status()
            rows = resp.json()
            return rows[0] if rows else None
        except Exception:
            return None

    def fetch_profile_by_clerk(self, clerk_user_id: str) -> dict | None:
        """Fetch a profile by Clerk user ID. Returns None if not found."""
        if not self.available:
            return None
        try:
            resp = httpx.get(
                f"{self.url}/rest/v1/profiles?clerk_user_id=eq.{clerk_user_id}&select=*",
                headers=self._headers,
                timeout=10.0,
            )
            resp.raise_for_status()
            rows = resp.json()
            return rows[0] if rows else None
        except Exception:
            return None


# Singleton
_client: SupabaseClient | None = None


def get_supabase() -> SupabaseClient:
    global _client
    if _client is None:
        _client = SupabaseClient()
    return _client
