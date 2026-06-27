"""Recipe listing endpoints."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import Recipe, get_db
from app.schemas import RecipeOut
from app.services.mappers import recipe_to_out

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.get("", response_model=List[RecipeOut])
def list_recipes(
    meal_type: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Recipe)
    if meal_type:
        q = q.filter(Recipe.meal_type == meal_type)
    rows = q.all()
    out = [recipe_to_out(r) for r in rows]
    if tag:
        out = [r for r in out if tag in r.tags]
    return out


@router.get("/{recipe_id}", response_model=RecipeOut)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    r = db.get(Recipe, recipe_id)
    if not r:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe_to_out(r)
