"""Profile CRUD + nutrition target endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import UserProfile, get_db
from app.schemas import (
    ActivityLevel,
    Gender,
    Goal,
    NutritionTarget,
    UserProfileCreate,
    UserProfileOut,
)
from app.services.nutrition import compute_target

router = APIRouter(prefix="/api/profiles", tags=["profiles"])


def _to_out(p: UserProfile) -> UserProfileOut:
    return UserProfileOut(
        id=p.id,
        name=p.name,
        gender=p.gender,
        age=p.age,
        height_cm=p.height_cm,
        weight_kg=p.weight_kg,
        body_fat_pct=p.body_fat_pct,
        activity_level=p.activity_level,
        goal=p.goal,
        allergens=p.allergens,
        disliked_tags=p.disliked_tags,
        diet_preference=p.diet_preference,
        created_at=p.created_at,
    )


@router.post("", response_model=UserProfileOut)
def create_profile(payload: UserProfileCreate, db: Session = Depends(get_db)):
    p = UserProfile(
        name=payload.name,
        gender=payload.gender.value,
        age=payload.age,
        height_cm=payload.height_cm,
        weight_kg=payload.weight_kg,
        body_fat_pct=payload.body_fat_pct,
        activity_level=payload.activity_level.value,
        goal=payload.goal.value,
        diet_preference=payload.diet_preference,
    )
    p.allergens = payload.allergens
    p.disliked_tags = payload.disliked_tags
    db.add(p)
    db.commit()
    db.refresh(p)
    return _to_out(p)


@router.get("/{profile_id}", response_model=UserProfileOut)
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    p = db.get(UserProfile, profile_id)
    if not p:
        raise HTTPException(status_code=404, detail="Profile not found")
    return _to_out(p)


@router.put("/{profile_id}", response_model=UserProfileOut)
def update_profile(profile_id: int, payload: UserProfileCreate,
                   db: Session = Depends(get_db)):
    p = db.get(UserProfile, profile_id)
    if not p:
        raise HTTPException(status_code=404, detail="Profile not found")
    p.name = payload.name
    p.gender = payload.gender.value
    p.age = payload.age
    p.height_cm = payload.height_cm
    p.weight_kg = payload.weight_kg
    p.body_fat_pct = payload.body_fat_pct
    p.activity_level = payload.activity_level.value
    p.goal = payload.goal.value
    p.diet_preference = payload.diet_preference
    p.allergens = payload.allergens
    p.disliked_tags = payload.disliked_tags
    db.commit()
    db.refresh(p)
    return _to_out(p)


@router.get("/{profile_id}/target", response_model=NutritionTarget)
def get_target(profile_id: int, db: Session = Depends(get_db)):
    p = db.get(UserProfile, profile_id)
    if not p:
        raise HTTPException(status_code=404, detail="Profile not found")
    return compute_target(
        gender=Gender(p.gender),
        age=p.age,
        height_cm=p.height_cm,
        weight_kg=p.weight_kg,
        activity_level=ActivityLevel(p.activity_level),
        goal=Goal(p.goal),
    )
