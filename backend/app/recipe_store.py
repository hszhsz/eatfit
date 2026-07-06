"""Recipe store — tries Supabase first, falls back to in-memory seed data.

This ensures:
- In production (with SUPABASE_URL + SUPABASE_SERVICE_KEY): recipes persist in DB
- In local dev (no service key): recipes still work from seed data
- Seeding is automatic: if Supabase recipes table is empty, seed it
"""
from __future__ import annotations

from app.data.recipes_seed import RECIPES
from app.schemas import IngredientItem, MealType, RecipeOut
from app.supabase_client import get_supabase

_fallback_store: list[RecipeOut] | None = None


def _build_recipe(index: int, data: dict) -> RecipeOut:
    return RecipeOut(
        id=index + 1,
        name=data["name"],
        meal_type=MealType(data["meal_type"]),
        calories=data["calories"],
        protein_g=data["protein_g"],
        carbs_g=data["carbs_g"],
        fat_g=data["fat_g"],
        tags=data["tags"],
        allergens=data["allergens"],
        cook_minutes=data["cook_minutes"],
        ingredients=[IngredientItem(**i) for i in data["ingredients"]],
        steps=data["steps"],
        image_emoji=data.get("image_emoji", "🍽️"),
    )


def _get_fallback() -> list[RecipeOut]:
    global _fallback_store
    if _fallback_store is None:
        _fallback_store = [_build_recipe(i, r) for i, r in enumerate(RECIPES)]
    return _fallback_store


def get_all_recipes() -> list[RecipeOut]:
    """Return all recipes.

    Tries Supabase first; if unavailable or empty after seeding attempt,
    falls back to in-memory seed data.
    """
    sb = get_supabase()
    if sb.available:
        recipes = sb.fetch_recipes()
        if recipes:
            return recipes
        # Try to seed
        count = sb.seed_recipes_if_empty()
        if count > 0:
            return sb.fetch_recipes()
    # Fallback to in-memory
    return _get_fallback()
