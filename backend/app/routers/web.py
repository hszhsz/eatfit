"""Stateless Web endpoints — receive profile via POST, compute and return."""
from __future__ import annotations

import hashlib
from types import SimpleNamespace

from fastapi import APIRouter

from app.recipe_store import get_all_recipes
from app.schemas import (
    ActivityLevel,
    CoachResponse,
    DailyPlanOut,
    Gender,
    Goal,
    GroceryListOut,
    NutritionTarget,
    WebCoachAdviceRequest,
    WebPlanRequest,
    WebTargetRequest,
)
from app.services.llm_coach import generate_coach_advice
from app.services.nutrition import compute_target
from app.services.planner import build_daily_plan, build_grocery_list

router = APIRouter(prefix="/api/web", tags=["web"])


def _compute_target(payload: WebTargetRequest | WebPlanRequest | WebCoachAdviceRequest) -> NutritionTarget:
    profile = payload.profile
    return compute_target(
        gender=Gender(profile.gender),
        age=profile.age,
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
        activity_level=ActivityLevel(profile.activity_level),
        goal=Goal(profile.goal),
    )


def _profile_seed(data: dict) -> int:
    digest = hashlib.md5(
        f"{data['name']}:{data['age']}:{data['height_cm']}:{data['weight_kg']}:{data['goal']}".encode()
    ).hexdigest()
    return int(digest[:7], 16)


def _profile_namespace(data: dict) -> SimpleNamespace:
    return SimpleNamespace(**data)


@router.post("/target", response_model=NutritionTarget)
def get_target(body: WebTargetRequest):
    return _compute_target(body)


@router.post("/plan", response_model=DailyPlanOut)
def get_plan(body: WebPlanRequest):
    profile = body.profile.dict()
    target = _compute_target(body)
    recipes = get_all_recipes()
    return build_daily_plan(
        profile_id=_profile_seed(profile),
        target=target,
        goal=Goal(profile["goal"]),
        recipes=recipes,
        allergens=profile["allergens"],
        disliked=profile["disliked_tags"],
        diet_preference=profile.get("diet_preference"),
        plan_date=body.date,
    )


@router.post("/grocery", response_model=GroceryListOut)
def get_grocery(body: WebPlanRequest):
    plan = get_plan(body)
    return build_grocery_list(plan)


@router.post("/coach/advice", response_model=CoachResponse)
def get_advice(body: WebCoachAdviceRequest):
    profile = body.profile.dict()
    target = _compute_target(body)
    recipes = get_all_recipes()
    plan = build_daily_plan(
        profile_id=_profile_seed(profile),
        target=target,
        goal=Goal(profile["goal"]),
        recipes=recipes,
        allergens=profile["allergens"],
        disliked=profile["disliked_tags"],
        diet_preference=profile.get("diet_preference"),
        plan_date=body.date,
    )
    return generate_coach_advice(_profile_namespace(profile), target, plan, body.request)
