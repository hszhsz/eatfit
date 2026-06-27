"""Seed the database with the recipe library (idempotent)."""
from __future__ import annotations

import json

from app.data.recipes_seed import RECIPES
from app.database import Recipe, SessionLocal


def seed_recipes() -> int:
    db = SessionLocal()
    try:
        existing = db.query(Recipe).count()
        if existing > 0:
            return existing
        for r in RECIPES:
            db.add(Recipe(
                name=r["name"],
                meal_type=r["meal_type"],
                calories=r["calories"],
                protein_g=r["protein_g"],
                carbs_g=r["carbs_g"],
                fat_g=r["fat_g"],
                tags_json=json.dumps(r["tags"], ensure_ascii=False),
                allergens_json=json.dumps(r["allergens"], ensure_ascii=False),
                cook_minutes=r["cook_minutes"],
                ingredients_json=json.dumps(r["ingredients"], ensure_ascii=False),
                steps_json=json.dumps(r["steps"], ensure_ascii=False),
                image_emoji=r.get("image_emoji", "🍽️"),
            ))
        db.commit()
        return db.query(Recipe).count()
    finally:
        db.close()
