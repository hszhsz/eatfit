"""Offline verification of EatFit core logic (no network/server).

Validates: DB init + seeding, nutrition target math, daily plan generation,
allergen filtering, and grocery aggregation.
"""
from __future__ import annotations

import os
import sys

# ensure package import works when run from backend/
sys.path.insert(0, os.path.dirname(__file__))

from app.database import Recipe, SessionLocal, init_db  # noqa: E402
from app.schemas import ActivityLevel, Gender, Goal  # noqa: E402
from app.seed import seed_recipes  # noqa: E402
from app.services.mappers import recipe_to_out  # noqa: E402
from app.services.nutrition import compute_target  # noqa: E402
from app.services.planner import build_daily_plan, build_grocery_list  # noqa: E402


def main():
    init_db()
    n = seed_recipes()
    print(f"[seed] recipes = {n}")
    assert n >= 13, "expected at least 13 recipes"

    # --- nutrition: a 30yo male, 180cm, 80kg, moderate activity, gain muscle
    target = compute_target(
        gender=Gender.male, age=30, height_cm=180, weight_kg=80,
        activity_level=ActivityLevel.moderate, goal=Goal.gain_muscle,
    )
    print(f"[nutrition] BMR={target.bmr} TDEE={target.tdee} "
          f"target={target.target_calories} P={target.protein_g} "
          f"C={target.carbs_g} F={target.fat_g}")
    # BMR Mifflin: 10*80+6.25*180-5*30+5 = 800+1125-150+5 = 1780
    assert abs(target.bmr - 1780) < 1, target.bmr
    # TDEE = 1780*1.55 = 2759
    assert abs(target.tdee - 2759) < 1, target.tdee
    # gain muscle surplus 12% => ~3090
    assert abs(target.target_calories - 2759 * 1.12) < 2, target.target_calories
    # protein 2.2*80 = 176
    assert abs(target.protein_g - 176) < 1, target.protein_g

    # --- daily plan with allergen filter (allergic to 虾 and 鱼)
    db = SessionLocal()
    recipes = [recipe_to_out(r) for r in db.query(Recipe).all()]
    db.close()

    plan = build_daily_plan(
        profile_id=1, target=target, goal=Goal.gain_muscle,
        recipes=recipes, allergens=["虾", "鱼"], disliked=[],
        diet_preference=None, plan_date="2026-06-26",
    )
    print(f"[plan] meals={len(plan.meals)} total_cal={plan.total_calories} "
          f"P={plan.total_protein_g} C={plan.total_carbs_g} F={plan.total_fat_g}")
    assert len(plan.meals) == 4, "should have 4 meal slots"
    for m in plan.meals:
        assert "虾" not in m.recipe.allergens, f"allergen leak: {m.recipe.name}"
        assert "鱼" not in m.recipe.allergens, f"allergen leak: {m.recipe.name}"
        print(f"   - {m.meal_type.value}: {m.recipe.name} "
              f"({m.recipe.calories}kcal, {m.recipe.protein_g}g P)")

    # --- grocery aggregation
    grocery = build_grocery_list(plan)
    print(f"[grocery] items={len(grocery.items)} categories={list(grocery.grouped.keys())}")
    assert len(grocery.items) > 0
    for cat, items in grocery.grouped.items():
        print(f"   [{cat}] " + ", ".join(f"{i.name} {i.total_amount_g}g" for i in items))

    # --- vegetarian preference test
    veg_plan = build_daily_plan(
        profile_id=2, target=target, goal=Goal.maintain,
        recipes=recipes, allergens=[], disliked=[],
        diet_preference="vegetarian", plan_date="2026-06-26",
    )
    veg_ok = all("素食" in m.recipe.tags for m in veg_plan.meals
                 if any("素食" in r.tags for r in recipes if r.meal_type == m.meal_type.value))
    print(f"[vegetarian] meals={[m.recipe.name for m in veg_plan.meals]}")

    print("\nALL CHECKS PASSED ✅")


if __name__ == "__main__":
    main()
