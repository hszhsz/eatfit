"""AI nutrition coach endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import Recipe, UserProfile, get_db
from app.schemas import ActivityLevel, CoachRequest, CoachResponse, Gender, Goal
from app.services.llm_coach import generate_coach_advice
from app.services.mappers import recipe_to_out
from app.services.nutrition import compute_target
from app.services.planner import build_daily_plan

router = APIRouter(prefix="/api/coach", tags=["coach"])


@router.post("/{profile_id}/advice", response_model=CoachResponse)
def get_coach_advice(
    profile_id: int,
    body: CoachRequest,
    db: Session = Depends(get_db),
):
    profile = db.get(UserProfile, profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    target = compute_target(
        gender=Gender(profile.gender),
        age=profile.age,
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
        activity_level=ActivityLevel(profile.activity_level),
        goal=Goal(profile.goal),
    )
    recipes = [recipe_to_out(r) for r in db.query(Recipe).all()]
    plan = build_daily_plan(
        profile_id=profile_id,
        target=target,
        goal=Goal(profile.goal),
        recipes=recipes,
        allergens=profile.allergens,
        disliked=profile.disliked_tags,
        diet_preference=profile.diet_preference,
    )
    return generate_coach_advice(profile, target, plan, body)
