"""Meal planning engine.

Given a user's nutrition target and preferences, select recipes for each meal
slot, scaling them so the daily total tracks the calorie/macro target. Also
aggregates a grocery list across the day's meals.
"""
from __future__ import annotations

import hashlib
from datetime import date
from typing import List

from app.schemas import (
    DailyPlanOut,
    Goal,
    GroceryItem,
    GroceryListOut,
    IngredientItem,
    MealItem,
    MealType,
    NutritionTarget,
    RecipeOut,
)

# fraction of daily target calories per meal slot
MEAL_CALORIE_SHARE = {
    MealType.breakfast: 0.25,
    MealType.lunch: 0.35,
    MealType.dinner: 0.30,
    MealType.snack: 0.10,
}

GOAL_TAG = {
    Goal.lose_fat: "减脂",
    Goal.maintain: "保持",
    Goal.gain_muscle: "增肌",
}


def _recipe_allowed(recipe: RecipeOut, allergens: List[str], disliked: List[str],
                    diet_preference: str | None) -> bool:
    # exclude any recipe containing a user allergen
    for a in allergens:
        if a in recipe.allergens:
            return False
    # exclude recipes tagged with something the user dislikes
    for d in disliked:
        if d in recipe.tags or d in recipe.allergens:
            return False
    # vegetarian preference: require 素食 tag
    if diet_preference == "vegetarian" and "素食" not in recipe.tags:
        return False
    return True


def _score(recipe: RecipeOut, goal: Goal, target_slot_cal: float) -> float:
    """Lower score is better. Reward goal match and calorie proximity."""
    score = abs(recipe.calories - target_slot_cal)
    if GOAL_TAG[goal] in recipe.tags:
        score -= 120  # strong preference for goal-aligned recipes
    if goal in (Goal.gain_muscle,) and "高蛋白" in recipe.tags:
        score -= 40
    if goal == Goal.lose_fat and "低脂" in recipe.tags:
        score -= 40
    return score


def _pick(recipes: List[RecipeOut], meal: MealType, goal: Goal,
          target_slot_cal: float, salt: str) -> RecipeOut | None:
    candidates = [r for r in recipes if r.meal_type == meal]
    if not candidates:
        return None
    candidates.sort(key=lambda r: _score(r, goal, target_slot_cal))
    # deterministic but varied pick: rotate among the top-3 by date hash
    top = candidates[: min(3, len(candidates))]
    idx = int(hashlib.md5(f"{meal}{salt}".encode()).hexdigest(), 16) % len(top)
    return top[idx]


def build_daily_plan(
    *,
    profile_id: int,
    target: NutritionTarget,
    goal: Goal,
    recipes: List[RecipeOut],
    allergens: List[str],
    disliked: List[str],
    diet_preference: str | None,
    plan_date: str | None = None,
) -> DailyPlanOut:
    plan_date = plan_date or date.today().isoformat()
    allowed = [
        r for r in recipes
        if _recipe_allowed(r, allergens, disliked, diet_preference)
    ]

    meals: List[MealItem] = []
    for meal in [MealType.breakfast, MealType.lunch, MealType.dinner, MealType.snack]:
        slot_cal = target.target_calories * MEAL_CALORIE_SHARE[meal]
        chosen = _pick(allowed, meal, goal, slot_cal, salt=plan_date + str(profile_id))
        if chosen is None:
            # fall back to ignoring preferences for this slot so plan is complete
            chosen = _pick(recipes, meal, goal, slot_cal, salt=plan_date)
        if chosen is not None:
            meals.append(MealItem(meal_type=meal, recipe=chosen))

    total_cal = sum(m.recipe.calories for m in meals)
    total_p = sum(m.recipe.protein_g for m in meals)
    total_c = sum(m.recipe.carbs_g for m in meals)
    total_f = sum(m.recipe.fat_g for m in meals)

    return DailyPlanOut(
        date=plan_date,
        profile_id=profile_id,
        target=target,
        meals=meals,
        total_calories=round(total_cal, 1),
        total_protein_g=round(total_p, 1),
        total_carbs_g=round(total_c, 1),
        total_fat_g=round(total_f, 1),
    )


def build_grocery_list(plan: DailyPlanOut) -> GroceryListOut:
    """Aggregate ingredients across the plan's meals, merging duplicates."""
    agg: dict[str, GroceryItem] = {}
    for meal in plan.meals:
        for ing in meal.recipe.ingredients:
            key = ing.name
            if key in agg:
                agg[key].total_amount_g += ing.amount_g
            else:
                agg[key] = GroceryItem(
                    name=ing.name,
                    total_amount_g=ing.amount_g,
                    category=ing.category,
                )

    items = sorted(agg.values(), key=lambda x: (x.category, x.name))
    for it in items:
        it.total_amount_g = round(it.total_amount_g, 1)

    grouped: dict[str, List[GroceryItem]] = {}
    for it in items:
        grouped.setdefault(it.category, []).append(it)

    return GroceryListOut(
        date=plan.date,
        profile_id=plan.profile_id,
        items=items,
        grouped=grouped,
    )
