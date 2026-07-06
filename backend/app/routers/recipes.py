"""Recipe listing endpoints — backed by in-memory store."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.recipe_store import get_all_recipes
from app.schemas import RecipeOut

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.get("", response_model=List[RecipeOut])
def list_recipes(
    meal_type: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
):
    recipes = get_all_recipes()
    if meal_type:
        recipes = [r for r in recipes if r.meal_type.value == meal_type]
    if tag:
        recipes = [r for r in recipes if tag in r.tags]
    return recipes


@router.get("/{recipe_id}", response_model=RecipeOut)
def get_recipe(recipe_id: int):
    recipes = get_all_recipes()
    for r in recipes:
        if r.id == recipe_id:
            return r
    raise HTTPException(status_code=404, detail="Recipe not found")
