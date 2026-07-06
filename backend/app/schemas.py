"""Pydantic schemas: request/response data contracts for the EatFit API."""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# ---------- Enums ----------
class Gender(str, Enum):
    male = "male"
    female = "female"


class Goal(str, Enum):
    """User dietary goal."""
    lose_fat = "lose_fat"      # 减脂
    maintain = "maintain"      # 保持
    gain_muscle = "gain_muscle"  # 增肌


class ActivityLevel(str, Enum):
    sedentary = "sedentary"          # 久坐 1.2
    light = "light"                  # 轻度活动 1.375
    moderate = "moderate"            # 中度活动 1.55
    active = "active"                # 高度活动 1.725
    very_active = "very_active"      # 极高强度 1.9


class MealType(str, Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"


class CoachFocus(str, Enum):
    daily_review = "daily_review"
    meal_strategy = "meal_strategy"
    eating_out = "eating_out"
    cravings = "cravings"


# ---------- User / Profile ----------
class UserProfileBase(BaseModel):
    name: str = Field(..., examples=["小明"])
    gender: Gender
    age: int = Field(..., ge=10, le=100)
    height_cm: float = Field(..., ge=100, le=250, description="身高 cm")
    weight_kg: float = Field(..., ge=30, le=250, description="体重 kg")
    body_fat_pct: Optional[float] = Field(None, ge=3, le=60, description="体脂率 %")
    activity_level: ActivityLevel = ActivityLevel.sedentary
    goal: Goal = Goal.maintain
    allergens: List[str] = Field(default_factory=list, description="过敏原标签")
    disliked_tags: List[str] = Field(default_factory=list, description="忌口/不喜欢的标签")
    diet_preference: Optional[str] = Field(None, description="饮食偏好,如 normal/vegetarian")


class UserProfileCreate(UserProfileBase):
    pass


class UserProfileOut(UserProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


# ---------- Nutrition target ----------
class NutritionTarget(BaseModel):
    bmr: float = Field(..., description="基础代谢率 kcal")
    tdee: float = Field(..., description="每日总消耗 kcal")
    target_calories: float = Field(..., description="目标摄入 kcal")
    protein_g: float
    carbs_g: float
    fat_g: float
    explanation: str


# ---------- Recipe ----------
class IngredientItem(BaseModel):
    name: str
    amount_g: float
    category: str = "其他"


class RecipeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    meal_type: MealType
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    tags: List[str]
    allergens: List[str]
    cook_minutes: int
    ingredients: List[IngredientItem]
    steps: List[str]
    image_emoji: str = "🍽️"



# ---------- Meal plan ----------
class MealItem(BaseModel):
    meal_type: MealType
    recipe: RecipeOut


class DailyPlanOut(BaseModel):
    date: str
    profile_id: int
    target: NutritionTarget
    meals: List[MealItem]
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float


# ---------- Grocery list ----------
class GroceryItem(BaseModel):
    name: str
    total_amount_g: float
    category: str


class GroceryListOut(BaseModel):
    date: str
    profile_id: int
    items: List[GroceryItem]
    grouped: dict[str, List[GroceryItem]]


# ---------- AI coach ----------
class CoachRequest(BaseModel):
    message: Optional[str] = Field(
        None,
        description="用户补充说明，例如今天吃了什么、接下来想怎么吃、当前困扰等",
    )
    focus: CoachFocus = CoachFocus.daily_review


class CoachResponse(BaseModel):
    focus: CoachFocus
    headline: str
    summary: str
    score: int = Field(..., ge=0, le=100, description="本次建议对应的执行质量评分")
    risk_alerts: List[str] = Field(default_factory=list)
    nutrition_insights: List[str] = Field(default_factory=list)
    next_actions: List[str] = Field(default_factory=list)
    meal_strategy: List[str] = Field(default_factory=list)
    disclaimer: str = "建议仅作饮食管理参考，存在慢病、孕期或特殊医疗情况时应咨询医生或注册营养师。"


# ---------- Web stateless requests ----------
# Option A: send full profile (backward compat)
class WebTargetRequest(BaseModel):
    profile: UserProfileCreate


class WebPlanRequest(BaseModel):
    profile: UserProfileCreate
    date: Optional[str] = None


class WebCoachAdviceRequest(BaseModel):
    profile: UserProfileCreate
    request: CoachRequest
    date: Optional[str] = None


# Option B: reference profile by UUID (Supabase persisted)
class ProfileByIdRequest(BaseModel):
    profile_id: str = Field(..., description="Supabase profile UUID")
    date: Optional[str] = None


class CoachByIdRequest(BaseModel):
    profile_id: str = Field(..., description="Supabase profile UUID")
    request: CoachRequest
    date: Optional[str] = None
