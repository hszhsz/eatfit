"""In-memory recipe store — loads from seed data, no database needed.

Recipes are static curated data. The backend is stateless: it receives
profile data via POST from the frontend (which persists to Supabase),
computes plans/grocery/coach advice, and returns results.
"""
from __future__ import annotations

from app.data.recipes_seed import RECIPES
from app.schemas import IngredientItem, MealType, RecipeOut

_store: list[RecipeOut] | None = None


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


def get_all_recipes() -> list[RecipeOut]:
    """Return all recipes, building the store lazily on first call."""
    global _store
    if _store is None:
        _store = [_build_recipe(i, r) for i, r in enumerate(RECIPES)]
    return _store
