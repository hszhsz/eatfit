"""Web endpoints — two modes:

1. By profile data (POST body): backward compatible, frontend sends full profile
2. By profile_id (Supabase UUID): backend reads profile from Supabase

Both modes share the same nutrition/planner/coach engine.
"""
from __future__ import annotations

import hashlib
from types import SimpleNamespace
from typing import Any

from fastapi import APIRouter, HTTPException

from app.recipe_store import get_all_recipes
from app.schemas import (
    ActivityLevel,
    CoachByIdRequest,
    CoachChatRequest,
    CoachChatResponse,
    CoachResponse,
    DailyPlanOut,
    Gender,
    Goal,
    GroceryListOut,
    NutritionTarget,
    ProfileByIdRequest,
    WebCoachAdviceRequest,
    WebPlanRequest,
    WebTargetRequest,
)
from app.services.llm_coach import generate_coach_advice
from app.services.nutrition import compute_target
from app.services.planner import build_daily_plan, build_grocery_list
from app.supabase_client import get_supabase

router = APIRouter(prefix="/api/web", tags=["web"])

def _compute_target_from_profile(profile: dict | Any) -> NutritionTarget:
    if isinstance(profile, dict):
        gender = Gender(profile["gender"])
        age = profile["age"]
        height_cm = profile["height_cm"]
        weight_kg = profile["weight_kg"]
        activity_level = ActivityLevel(profile["activity_level"])
        goal = Goal(profile["goal"])
    else:
        gender = Gender(profile.gender)
        age = profile.age
        height_cm = profile.height_cm
        weight_kg = profile.weight_kg
        activity_level = ActivityLevel(profile.activity_level)
        goal = Goal(profile.goal)
    return compute_target(
        gender=gender,
        age=age,
        height_cm=height_cm,
        weight_kg=weight_kg,
        activity_level=activity_level,
        goal=goal,
    )


def _profile_seed(data: dict) -> int:
    digest = hashlib.md5(
        f"{data['name']}:{data['age']}:{data['height_cm']}:{data['weight_kg']}:{data['goal']}".encode()
    ).hexdigest()
    return int(digest[:7], 16)


def _profile_namespace(data: dict) -> SimpleNamespace:
    # Normalize Supabase row (snake_case keys) to namespace for LLM coach
    return SimpleNamespace(
        name=data.get("name", ""),
        gender=data.get("gender", ""),
        age=data.get("age", 0),
        height_cm=data.get("height_cm", 0),
        weight_kg=data.get("weight_kg", 0),
        body_fat_pct=data.get("body_fat_pct"),
        activity_level=data.get("activity_level", "sedentary"),
        goal=data.get("goal", "maintain"),
        allergens=data.get("allergens", []),
        disliked_tags=data.get("disliked_tags", []),
        diet_preference=data.get("diet_preference"),
    )


def _load_profile_from_supabase(profile_id: str) -> dict:
    """Load a profile from Supabase by UUID. Raises 404 if not found."""
    sb = get_supabase()
    if not sb.available:
        raise HTTPException(status_code=503, detail="Supabase not configured on backend.")
    profile = sb.fetch_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Profile {profile_id} not found")
    return profile


def _build_plan(profile: dict | Any, target: NutritionTarget, plan_date: str | None) -> DailyPlanOut:
    recipes = get_all_recipes()
    if isinstance(profile, dict):
        profile_id = _profile_seed(profile)
        allergens = profile.get("allergens", [])
        disliked = profile.get("disliked_tags", [])
        diet_pref = profile.get("diet_preference")
        goal = Goal(profile["goal"])
    else:
        # Supabase row dict
        profile_id = _profile_seed(profile)
        allergens = profile.allergens if hasattr(profile, "allergens") else []
        disliked = profile.disliked_tags if hasattr(profile, "disliked_tags") else []
        diet_pref = profile.diet_preference if hasattr(profile, "diet_preference") else None
        goal = Goal(profile.goal)
    return build_daily_plan(
        profile_id=profile_id,
        target=target,
        goal=goal,
        recipes=recipes,
        allergens=allergens,
        disliked=disliked,
        diet_preference=diet_pref,
        plan_date=plan_date,
    )


# ---------- Mode A: full profile in body (backward compat) ----------

@router.post("/target", response_model=NutritionTarget)
def get_target(body: WebTargetRequest):
    return _compute_target_from_profile(body.profile.model_dump(mode="json"))


@router.post("/plan", response_model=DailyPlanOut)
def get_plan(body: WebPlanRequest):
    profile = body.profile.model_dump(mode="json")
    target = _compute_target_from_profile(profile)
    return _build_plan(profile, target, body.date)


@router.post("/grocery", response_model=GroceryListOut)
def get_grocery(body: WebPlanRequest):
    plan = get_plan(body)
    return build_grocery_list(plan)


@router.post("/coach/advice", response_model=CoachResponse)
def get_advice(body: WebCoachAdviceRequest):
    profile = body.profile.model_dump(mode="json")
    target = _compute_target_from_profile(profile)
    plan = _build_plan(profile, target, body.date)
    return generate_coach_advice(_profile_namespace(profile), target, plan, body.request)

@router.post("/by-id/target", response_model=NutritionTarget)
def get_target_by_id(body: ProfileByIdRequest):
    profile = _load_profile_from_supabase(body.profile_id)
    return _compute_target_from_profile(profile)


@router.post("/by-id/plan", response_model=DailyPlanOut)
def get_plan_by_id(body: ProfileByIdRequest):
    profile = _load_profile_from_supabase(body.profile_id)
    target = _compute_target_from_profile(profile)
    return _build_plan(profile, target, body.date)


@router.post("/by-id/grocery", response_model=GroceryListOut)
def get_grocery_by_id(body: ProfileByIdRequest):
    plan = get_plan_by_id(body)
    return build_grocery_list(plan)


@router.post("/by-id/coach/advice", response_model=CoachResponse)
def get_advice_by_id(body: CoachByIdRequest):
    profile = _load_profile_from_supabase(body.profile_id)
    target = _compute_target_from_profile(profile)
    plan = _build_plan(profile, target, body.date)
    # Fetch conversation history from Supabase for multi-turn context
    sb = get_supabase()
    history = sb.fetch_recent_coach_messages(body.profile_id, limit=10) if sb.available else []
    return generate_coach_advice(_profile_namespace(profile), target, plan, body.request,
                                 conversation_history=history)


# ---------- Chat endpoint (multi-turn conversational coach) ----------

@router.post("/by-id/coach/chat", response_model=CoachChatResponse)
def coach_chat(body: CoachChatRequest):
    """Full conversational coach endpoint.

    - Creates a new session on first message (or reuses existing)
    - Saves user message to Supabase
    - Calls LLM with full conversation history
    - Saves assistant response to Supabase
    - Returns session info + structured response
    """
    sb = get_supabase()
    if not sb.available:
        raise HTTPException(status_code=503, detail="Supabase not configured on backend.")

    profile = _load_profile_from_supabase(body.profile_id)
    target = _compute_target_from_profile(profile)
    plan = _build_plan(profile, target, body.date)

    # Session: reuse or create
    session_id = body.session_id
    if session_id:
        # Verify session belongs to this profile
        sessions = sb.fetch_coach_sessions(body.profile_id)
        matching = [s for s in sessions if s["id"] == session_id]
        if not matching:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        # Auto-create session with title from first message
        title = body.message[:30] + ("…" if len(body.message) > 30 else "")
        new_session = sb.create_coach_session(
            body.profile_id,
            title=title,
            focus="daily_review",
        )
        if not new_session:
            raise HTTPException(status_code=500, detail="Failed to create session")
        session_id = new_session["id"]

    # Save user message
    user_msg = sb.create_coach_message(session_id, "user", body.message)
    if not user_msg:
        raise HTTPException(status_code=500, detail="Failed to save user message")

    # Fetch full conversation history for this session
    history = sb.fetch_coach_messages(session_id)
    # Convert to the format expected by llm_coach (role, message dicts)
    conversation_history = [
        {"role": m["role"], "message": m["message"]}
        for m in history
    ]

    # Call LLM with conversation context
    from app.schemas import CoachFocus, CoachRequest as CR
    coach_req = CR(
        focus=CoachFocus.daily_review,
        message=body.message,
    )
    response = generate_coach_advice(
        _profile_namespace(profile), target, plan, coach_req,
        conversation_history=conversation_history,
    )

    # Save assistant response with structured payload
    assistant_msg = sb.create_coach_message(
        session_id,
        "assistant",
        response.summary,
        structured_payload=response.model_dump(mode="json"),
    )

    # Update session timestamp
    sb.touch_coach_session(session_id)

    # Build session title from first message if new
    session_title = body.message[:30] + ("…" if len(body.message) > 30 else "")

    return CoachChatResponse(
        session_id=session_id,
        session_title=session_title,
        user_message_id=user_msg["id"],
        assistant_message_id=assistant_msg["id"] if assistant_msg else "",
        response=response,
    )


@router.get("/by-id/coach/sessions")
def list_coach_sessions(profile_id: str):
    """List all coach sessions for a profile."""
    sb = get_supabase()
    if not sb.available:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    return sb.fetch_coach_sessions(profile_id)


@router.get("/by-id/coach/sessions/{session_id}/messages")
def list_coach_messages(session_id: str):
    """List all messages for a coach session."""
    sb = get_supabase()
    if not sb.available:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    return sb.fetch_coach_messages(session_id)
