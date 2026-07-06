"""Unit tests for the nutrition calculation engine."""
import pytest
from app.schemas import ActivityLevel, Gender, Goal
from app.services.nutrition import calc_bmr, calc_tdee, compute_target


class TestBMR:
    def test_male_bmr(self):
        # Mifflin-St Jeor: 10*72 + 6.25*175 - 5*30 + 5 = 720 + 1093.75 - 150 + 5 = 1668.75
        bmr = calc_bmr(Gender.male, 72, 175, 30)
        assert bmr == pytest.approx(1668.75, rel=0.001)

    def test_female_bmr(self):
        # 10*60 + 6.25*165 - 5*28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25
        bmr = calc_bmr(Gender.female, 60, 165, 28)
        assert bmr == pytest.approx(1330.25, rel=0.001)

    def test_extreme_values(self):
        # Tall heavy male
        bmr = calc_bmr(Gender.male, 120, 200, 25)
        assert 2000 < bmr < 3000
        # Short light female
        bmr = calc_bmr(Gender.female, 45, 150, 20)
        assert 1000 < bmr < 1500


class TestTDEE:
    def test_sedentary(self):
        tdee = calc_tdee(1500, ActivityLevel.sedentary)
        assert tdee == pytest.approx(1800, rel=0.001)

    def test_very_active(self):
        tdee = calc_tdee(1500, ActivityLevel.very_active)
        assert tdee == pytest.approx(2850, rel=0.001)


class TestComputeTarget:
    def test_lose_fat_creates_deficit(self):
        target = compute_target(
            gender=Gender.male, age=30, height_cm=175, weight_kg=80,
            activity_level=ActivityLevel.moderate, goal=Goal.lose_fat,
        )
        assert target.target_calories < target.tdee
        # 18% deficit
        assert target.target_calories == pytest.approx(target.tdee * 0.82, rel=0.01)

    def test_gain_muscle_creates_surplus(self):
        target = compute_target(
            gender=Gender.male, age=25, height_cm=180, weight_kg=75,
            activity_level=ActivityLevel.active, goal=Goal.gain_muscle,
        )
        assert target.target_calories > target.tdee
        # 12% surplus
        assert target.target_calories == pytest.approx(target.tdee * 1.12, rel=0.01)

    def test_maintain_equals_tdee(self):
        target = compute_target(
            gender=Gender.female, age=35, height_cm=165, weight_kg=60,
            activity_level=ActivityLevel.light, goal=Goal.maintain,
        )
        assert target.target_calories == pytest.approx(target.tdee, rel=0.01)

    def test_protein_anchored_to_bodyweight(self):
        target = compute_target(
            gender=Gender.male, age=30, height_cm=175, weight_kg=80,
            activity_level=ActivityLevel.moderate, goal=Goal.gain_muscle,
        )
        # 2.2 g/kg for gain_muscle
        assert target.protein_g == pytest.approx(80 * 2.2, rel=0.01)

    def test_explanation_contains_key_info(self):
        target = compute_target(
            gender=Gender.male, age=30, height_cm=175, weight_kg=80,
            activity_level=ActivityLevel.moderate, goal=Goal.lose_fat,
        )
        assert "BMR" in target.explanation or "基础代谢" in target.explanation
        assert "减脂" in target.explanation
        # explanation uses :.0f which rounds, so check the rounded value
        rounded_cal = int(round(target.target_calories))
        assert str(rounded_cal) in target.explanation
