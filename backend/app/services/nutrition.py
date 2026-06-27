"""Nutrition calculation engine.

Computes BMR (Mifflin-St Jeor), TDEE, goal-adjusted target calories and
macronutrient split (protein / carbs / fat). Pure functions, no I/O, so it is
trivially unit-testable.
"""
from __future__ import annotations

from app.schemas import ActivityLevel, Gender, Goal, NutritionTarget

ACTIVITY_FACTORS = {
    ActivityLevel.sedentary: 1.2,
    ActivityLevel.light: 1.375,
    ActivityLevel.moderate: 1.55,
    ActivityLevel.active: 1.725,
    ActivityLevel.very_active: 1.9,
}

# kcal per gram
KCAL_PROTEIN = 4.0
KCAL_CARBS = 4.0
KCAL_FAT = 9.0

# protein grams per kg bodyweight by goal
PROTEIN_PER_KG = {
    Goal.lose_fat: 2.0,
    Goal.maintain: 1.6,
    Goal.gain_muscle: 2.2,
}

# fat as fraction of total calories
FAT_RATIO = {
    Goal.lose_fat: 0.25,
    Goal.maintain: 0.28,
    Goal.gain_muscle: 0.25,
}

# calorie delta applied to TDEE by goal
CALORIE_DELTA = {
    Goal.lose_fat: -0.18,    # 18% deficit
    Goal.maintain: 0.0,
    Goal.gain_muscle: 0.12,  # 12% surplus
}


def calc_bmr(gender: Gender, weight_kg: float, height_cm: float, age: int) -> float:
    """Mifflin-St Jeor equation."""
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    if gender == Gender.male:
        return base + 5
    return base - 161


def calc_tdee(bmr: float, activity: ActivityLevel) -> float:
    return bmr * ACTIVITY_FACTORS[activity]


def compute_target(
    *,
    gender: Gender,
    age: int,
    height_cm: float,
    weight_kg: float,
    activity_level: ActivityLevel,
    goal: Goal,
) -> NutritionTarget:
    bmr = calc_bmr(gender, weight_kg, height_cm, age)
    tdee = calc_tdee(bmr, activity_level)
    target_cal = tdee * (1 + CALORIE_DELTA[goal])

    # protein anchored to bodyweight
    protein_g = PROTEIN_PER_KG[goal] * weight_kg
    protein_cal = protein_g * KCAL_PROTEIN

    # fat anchored to a fraction of total calories
    fat_cal = target_cal * FAT_RATIO[goal]
    fat_g = fat_cal / KCAL_FAT

    # carbs fill the remainder
    carbs_cal = max(target_cal - protein_cal - fat_cal, 0)
    carbs_g = carbs_cal / KCAL_CARBS

    goal_label = {
        Goal.lose_fat: "减脂",
        Goal.maintain: "保持",
        Goal.gain_muscle: "增肌",
    }[goal]

    explanation = (
        f"基于 Mifflin-St Jeor 公式,你的基础代谢约 {bmr:.0f} kcal,"
        f"结合活动系数后每日总消耗约 {tdee:.0f} kcal。"
        f"为达成「{goal_label}」目标,目标摄入设为 {target_cal:.0f} kcal,"
        f"蛋白质 {protein_g:.0f}g、碳水 {carbs_g:.0f}g、脂肪 {fat_g:.0f}g。"
    )

    return NutritionTarget(
        bmr=round(bmr, 1),
        tdee=round(tdee, 1),
        target_calories=round(target_cal, 1),
        protein_g=round(protein_g, 1),
        carbs_g=round(carbs_g, 1),
        fat_g=round(fat_g, 1),
        explanation=explanation,
    )
