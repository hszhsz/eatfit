"""Helpers to convert ORM rows into Pydantic response models."""
from __future__ import annotations

import json

from app.database import Recipe
from app.schemas import IngredientItem, RecipeOut


def recipe_to_out(r: Recipe) -> RecipeOut:
    return RecipeOut(
        id=r.id,
        name=r.name,
        meal_type=r.meal_type,
        calories=r.calories,
        protein_g=r.protein_g,
        carbs_g=r.carbs_g,
        fat_g=r.fat_g,
        tags=json.loads(r.tags_json or "[]"),
        allergens=json.loads(r.allergens_json or "[]"),
        cook_minutes=r.cook_minutes,
        ingredients=[IngredientItem(**i) for i in json.loads(r.ingredients_json or "[]")],
        steps=json.loads(r.steps_json or "[]"),
        image_emoji=r.image_emoji,
    )
