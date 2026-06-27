"""Daily meal plan + grocery list endpoints."""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import Recipe, UserProfile, get_db
from app.schemas import (
    ActivityLevel,
    DailyPlanOut,
    Gender,
    Goal,
    GroceryListOut,
)
from app.services.mappers import recipe_to_out
from app.services.nutrition import compute_target
from app.services.planner import build_daily_plan, build_grocery_list

router = APIRouter(prefix="/api/plan", tags=["plan"])


def _load(db: Session, profile_id: int) -> DailyPlanOut:
    p = db.get(UserProfile, profile_id)
    if not p:
        raise HTTPException(status_code=404, detail="Profile not found")
    target = compute_target(
        gender=Gender(p.gender),
        age=p.age,
        height_cm=p.height_cm,
        weight_kg=p.weight_kg,
        activity_level=ActivityLevel(p.activity_level),
        goal=Goal(p.goal),
    )
    recipes = [recipe_to_out(r) for r in db.query(Recipe).all()]
    return p, target, recipes


@router.get("/{profile_id}", response_model=DailyPlanOut)
def get_daily_plan(profile_id: int, date: Optional[str] = Query(None),
                   db: Session = Depends(get_db)):
    p, target, recipes = _load(db, profile_id)
    return build_daily_plan(
        profile_id=profile_id,
        target=target,
        goal=Goal(p.goal),
        recipes=recipes,
        allergens=p.allergens,
        disliked=p.disliked_tags,
        diet_preference=p.diet_preference,
        plan_date=date,
    )


@router.get("/{profile_id}/grocery", response_model=GroceryListOut)
def get_grocery_list(profile_id: int, date: Optional[str] = Query(None),
                     db: Session = Depends(get_db)):
    p, target, recipes = _load(db, profile_id)
    plan = build_daily_plan(
        profile_id=profile_id,
        target=target,
        goal=Goal(p.goal),
        recipes=recipes,
        allergens=p.allergens,
        disliked=p.disliked_tags,
        diet_preference=p.diet_preference,
        plan_date=date,
    )
    return build_grocery_list(plan)
