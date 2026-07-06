"""Unit tests for the meal planner."""
import pytest
from app.schemas import (
    Goal, MealType, NutritionTarget, RecipeOut, IngredientItem,
)
from app.services.planner import build_daily_plan, build_grocery_list


def _make_recipe(
    id: int, name: str, meal_type: MealType, calories: float,
    protein_g: float = 20, carbs_g: float = 50, fat_g: float = 10,
    tags: list[str] = None, allergens: list[str] = None,
    ingredients: list[IngredientItem] = None,
) -> RecipeOut:
    return RecipeOut(
        id=id, name=name, meal_type=meal_type,
        calories=calories, protein_g=protein_g, carbs_g=carbs_g, fat_g=fat_g,
        tags=tags or [], allergens=allergens or [],
        cook_minutes=15,
        ingredients=ingredients or [],
        steps=["step1", "step2"],
        image_emoji="🍽️",
    )


def _make_target(cal: float = 2000) -> NutritionTarget:
    return NutritionTarget(
        bmr=1600, tdee=2000, target_calories=cal,
        protein_g=150, carbs_g=200, fat_g=60,
        explanation="test",
    )


class TestBuildDailyPlan:
    def test_plan_has_four_meals(self):
        recipes = [
            _make_recipe(1, "Breakfast", MealType.breakfast, 500),
            _make_recipe(2, "Lunch", MealType.lunch, 700),
            _make_recipe(3, "Dinner", MealType.dinner, 600),
            _make_recipe(4, "Snack", MealType.snack, 200),
        ]
        plan = build_daily_plan(
            profile_id=1, target=_make_target(), goal=Goal.maintain,
            recipes=recipes, allergens=[], disliked=[], diet_preference=None,
        )
        assert len(plan.meals) == 4
        meal_types = {m.meal_type for m in plan.meals}
        assert meal_types == {MealType.breakfast, MealType.lunch, MealType.dinner, MealType.snack}

    def test_allergen_filtering(self):
        recipes = [
            _make_recipe(1, "Peanut Butter Toast", MealType.breakfast, 400, allergens=["花生"]),
            _make_recipe(2, "Oatmeal", MealType.breakfast, 350, allergens=[]),
            _make_recipe(3, "Chicken Rice", MealType.lunch, 700),
            _make_recipe(4, "Fish Veggies", MealType.dinner, 600),
            _make_recipe(5, "Yogurt", MealType.snack, 200),
        ]
        plan = build_daily_plan(
            profile_id=1, target=_make_target(), goal=Goal.maintain,
            recipes=recipes, allergens=["花生"], disliked=[], diet_preference=None,
        )
        # Peanut recipe should not appear
        assert all("Peanut" not in m.recipe.name for m in plan.meals)

    def test_diet_preference_vegetarian(self):
        recipes = [
            _make_recipe(1, "Veggie Bowl", MealType.breakfast, 350, tags=["素食"]),
            _make_recipe(2, "Chicken Salad", MealType.breakfast, 400, tags=["高蛋白"]),
            _make_recipe(3, "Tofu Soup", MealType.lunch, 500, tags=["素食"]),
            _make_recipe(4, "Veggie Stir Fry", MealType.dinner, 550, tags=["素食"]),
            _make_recipe(5, "Fruit Bowl", MealType.snack, 200, tags=["素食"]),
        ]
        plan = build_daily_plan(
            profile_id=1, target=_make_target(), goal=Goal.maintain,
            recipes=recipes, allergens=[], disliked=[], diet_preference="vegetarian",
        )
        assert all("素食" in m.recipe.tags for m in plan.meals)

    def test_plan_totals_match_meal_sum(self):
        recipes = [
            _make_recipe(1, "B", MealType.breakfast, 500, protein_g=30, carbs_g=60, fat_g=15),
            _make_recipe(2, "L", MealType.lunch, 700, protein_g=45, carbs_g=80, fat_g=20),
            _make_recipe(3, "D", MealType.dinner, 600, protein_g=40, carbs_g=70, fat_g=18),
            _make_recipe(4, "S", MealType.snack, 200, protein_g=10, carbs_g=25, fat_g=5),
        ]
        plan = build_daily_plan(
            profile_id=1, target=_make_target(), goal=Goal.maintain,
            recipes=recipes, allergens=[], disliked=[], diet_preference=None,
        )
        assert plan.total_calories == pytest.approx(sum(r.calories for r in recipes), rel=0.01)
        assert plan.total_protein_g == pytest.approx(sum(r.protein_g for r in recipes), rel=0.01)


class TestBuildGroceryList:
    def test_aggregates_duplicate_ingredients(self):
        recipes = [
            _make_recipe(1, "A", MealType.breakfast, 400,
                         ingredients=[IngredientItem(name="鸡蛋", amount_g=100, category="肉蛋水产")]),
            _make_recipe(2, "B", MealType.lunch, 600,
                         ingredients=[IngredientItem(name="鸡蛋", amount_g=50, category="肉蛋水产")]),
            _make_recipe(3, "C", MealType.dinner, 500,
                         ingredients=[IngredientItem(name="米饭", amount_g=80, category="主食粮油")]),
            _make_recipe(4, "D", MealType.snack, 200,
                         ingredients=[]),
        ]
        plan = build_daily_plan(
            profile_id=1, target=_make_target(), goal=Goal.maintain,
            recipes=recipes, allergens=[], disliked=[], diet_preference=None,
        )
        grocery = build_grocery_list(plan)
        egg = next(i for i in grocery.items if i.name == "鸡蛋")
        assert egg.total_amount_g == pytest.approx(150, rel=0.01)
        assert len(grocery.grouped) >= 1

    def test_empty_plan_produces_empty_list(self):
        from app.schemas import DailyPlanOut
        plan = DailyPlanOut(
            date="2026-01-01", profile_id=1, target=_make_target(),
            meals=[], total_calories=0, total_protein_g=0, total_carbs_g=0, total_fat_g=0,
        )
        grocery = build_grocery_list(plan)
        assert len(grocery.items) == 0
        assert len(grocery.grouped) == 0
