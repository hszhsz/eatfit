"""Persistent data CRUD endpoints — protected by Clerk JWT auth.

All endpoints require a valid Clerk session token (Authorization: Bearer <token>).
The backend uses service_role to bypass Supabase RLS and enforces access control
in the application layer based on the Clerk user ID from the JWT.
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import get_clerk_user_id
from app.supabase_client import get_supabase

router = APIRouter(prefix="/api/data", tags=["data"])


# ---------- Schemas ----------

class ProfileUpsertRequest(BaseModel):
    name: str
    gender: str  # "male" | "female"
    age: int
    height_cm: float
    weight_kg: float
    body_fat_pct: Optional[float] = None
    activity_level: str
    goal: str  # "lose_fat" | "maintain" | "gain_muscle"
    allergens: list[str] = Field(default_factory=list)
    disliked_tags: list[str] = Field(default_factory=list)
    diet_preference: Optional[str] = None


class ProfileResponse(BaseModel):
    id: str  # UUID
    clerk_user_id: str
    name: str
    gender: str
    age: int
    height_cm: float
    weight_kg: float
    body_fat_pct: Optional[float] = None
    activity_level: str
    goal: str
    allergens: list
    disliked_tags: list
    diet_preference: Optional[str] = None
    created_at: str
    updated_at: str


# ---------- Profile CRUD ----------

@router.get("/profile", response_model=Optional[ProfileResponse])
def get_profile(clerk_user_id: str = Depends(get_clerk_user_id)):
    """Get the current user's profile. Returns null if no profile exists."""
    sb = get_supabase()
    if not sb.available:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        profile = sb.fetch_profile_by_clerk(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
    return profile


@router.put("/profile", response_model=ProfileResponse)
def upsert_profile(
    body: ProfileUpsertRequest,
    clerk_user_id: str = Depends(get_clerk_user_id),
):
    """Create or update the current user's profile."""
    sb = get_supabase()
    if not sb.available:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        profile = sb.upsert_profile(clerk_user_id, body.model_dump())
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
    return profile


@router.delete("/profile")
def delete_profile(clerk_user_id: str = Depends(get_clerk_user_id)):
    """Delete the current user's profile."""
    sb = get_supabase()
    if not sb.available:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        sb.delete_profile(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
    return {"ok": True}
