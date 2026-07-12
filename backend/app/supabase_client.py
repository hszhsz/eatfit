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
from datetime import datetime, timezone
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

    @staticmethod
    def _parse_profile_row(row: dict[str, Any]) -> dict[str, Any]:
        """Parse JSON-string fields from Supabase row back to Python lists."""
        for field in ("allergens", "disliked_tags"):
            val = row.get(field)
            if isinstance(val, str):
                row[field] = json.loads(val)
        return row

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
            return self._parse_profile_row(rows[0]) if rows else None
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
            return self._parse_profile_row(rows[0]) if rows else None
        except Exception:
            return None

    # ---------- Coach Sessions & Messages ----------

    # ---------- Profile CRUD ----------

    def upsert_profile(self, clerk_user_id: str, data: dict) -> dict:
        """Upsert a profile by clerk_user_id. Returns the upserted row."""
        if not self.available:
            raise RuntimeError("Supabase not configured")

        row = {
            "clerk_user_id": clerk_user_id,
            "name": data["name"],
            "gender": data["gender"],
            "age": data["age"],
            "height_cm": data["height_cm"],
            "weight_kg": data["weight_kg"],
            "body_fat_pct": data.get("body_fat_pct"),
            "activity_level": data["activity_level"],
            "goal": data["goal"],
            "allergens": json.dumps(data.get("allergens", [])),
            "disliked_tags": json.dumps(data.get("disliked_tags", [])),
            "diet_preference": data.get("diet_preference"),
            "updated_at": data.get("updated_at", datetime.now(timezone.utc).isoformat()),
        }

        try:
            existing = self.fetch_profile_by_clerk(clerk_user_id)
            if existing:
                # PATCH existing row
                resp = httpx.patch(
                    f"{self.url}/rest/v1/profiles?clerk_user_id=eq.{clerk_user_id}",
                    headers={**self._headers, "Prefer": "return=representation"},
                    json=row,
                    timeout=10.0,
                )
                resp.raise_for_status()
            else:
                # POST new row
                resp = httpx.post(
                    f"{self.url}/rest/v1/profiles",
                    headers={**self._headers, "Prefer": "return=representation"},
                    json=row,
                    timeout=10.0,
                )
                resp.raise_for_status()
            rows = resp.json()
            return self._parse_profile_row(rows[0]) if rows else row
        except httpx.HTTPStatusError as e:
            detail = e.response.text
            raise RuntimeError(f"Supabase upsert failed ({e.response.status_code}): {detail}")

    def delete_profile(self, clerk_user_id: str) -> None:
        """Delete a profile by clerk_user_id."""
        if not self.available:
            raise RuntimeError("Supabase not configured")
        try:
            resp = httpx.delete(
                f"{self.url}/rest/v1/profiles?clerk_user_id=eq.{clerk_user_id}",
                headers=self._headers,
                timeout=10.0,
            )
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            detail = e.response.text
            raise RuntimeError(f"Supabase delete failed ({e.response.status_code}): {detail}")

    # ---------- Coach Sessions & Messages ----------

    def create_coach_session(self, profile_id: str, title: str, focus: str) -> dict | None:
        """Create a new coach session. Returns the created row."""
        if not self.available:
            return None
        try:
            now = datetime.now(timezone.utc).isoformat()
            payload = {
                "profile_id": profile_id,
                "title": title,
                "focus": focus,
                "created_at": now,
                "updated_at": now,
            }
            resp = httpx.post(
                f"{self.url}/rest/v1/coach_sessions",
                headers={**self._headers, "Prefer": "return=representation"},
                json=payload,
                timeout=10.0,
            )
            resp.raise_for_status()
            rows = resp.json()
            return rows[0] if rows else None
        except Exception:
            return None

    def fetch_coach_sessions(self, profile_id: str) -> list[dict]:
        """Fetch all coach sessions for a profile, ordered by most recent."""
        if not self.available:
            return []
        try:
            resp = httpx.get(
                f"{self.url}/rest/v1/coach_sessions?profile_id=eq.{profile_id}&order=updated_at.desc&select=*",
                headers=self._headers,
                timeout=10.0,
            )
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return []

    def create_coach_message(
        self,
        session_id: str,
        role: str,
        message: str,
        structured_payload: dict | None = None,
    ) -> dict | None:
        """Save a coach message. Returns the created row."""
        if not self.available:
            return None
        try:
            payload = {
                "session_id": session_id,
                "role": role,
                "message": message,
                "structured_payload": json.dumps(structured_payload) if structured_payload else None,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            resp = httpx.post(
                f"{self.url}/rest/v1/coach_messages",
                headers={**self._headers, "Prefer": "return=representation"},
                json=payload,
                timeout=10.0,
            )
            resp.raise_for_status()
            rows = resp.json()
            return rows[0] if rows else None
        except Exception:
            return None

    def fetch_coach_messages(self, session_id: str) -> list[dict]:
        """Fetch all messages for a coach session, ordered by creation time."""
        if not self.available:
            return []
        try:
            resp = httpx.get(
                f"{self.url}/rest/v1/coach_messages?session_id=eq.{session_id}&order=created_at.asc&select=*",
                headers=self._headers,
                timeout=10.0,
            )
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return []

    def touch_coach_session(self, session_id: str) -> None:
        """Update updated_at on a session to keep it fresh."""
        if not self.available:
            return
        try:
            httpx.patch(
                f"{self.url}/rest/v1/coach_sessions?id=eq.{session_id}",
                headers=self._headers,
                json={"updated_at": datetime.now(timezone.utc).isoformat()},
                timeout=10.0,
            )
        except Exception:
            pass

    def fetch_recent_coach_messages(self, profile_id: str, limit: int = 10) -> list[dict]:
        """Fetch recent coach messages for a profile's latest session.

        Used to provide conversation history for multi-turn coaching.
        """
        if not self.available:
            return []
        try:
            # First get the latest session for this profile
            resp = httpx.get(
                f"{self.url}/rest/v1/coach_sessions?profile_id=eq.{profile_id}&order=updated_at.desc&limit=1&select=id",
                headers=self._headers,
                timeout=10.0,
            )
            resp.raise_for_status()
            sessions = resp.json()
            if not sessions:
                return []
            session_id = sessions[0]["id"]
            # Then get messages for that session
            resp = httpx.get(
                f"{self.url}/rest/v1/coach_messages?session_id=eq.{session_id}&order=created_at.asc&limit={limit}&select=role,message",
                headers=self._headers,
                timeout=10.0,
            )
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return []


# Singleton
_client: SupabaseClient | None = None


def get_supabase() -> SupabaseClient:
    global _client
    if _client is None:
        _client = SupabaseClient()
    return _client
