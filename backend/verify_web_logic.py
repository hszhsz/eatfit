"""Verification for stateless Web API endpoints."""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


PROFILE = {
    "name": "Alex",
    "gender": "male",
    "age": 29,
    "height_cm": 178,
    "weight_kg": 76,
    "body_fat_pct": 18,
    "activity_level": "moderate",
    "goal": "maintain",
    "allergens": ["虾"],
    "disliked_tags": ["鱼"],
    "diet_preference": None,
}


def main():
    client = TestClient(app)

    target = client.post("/api/web/target", json={"profile": PROFILE})
    assert target.status_code == 200, target.text
    target_payload = target.json()
    print("[web target]", target_payload["target_calories"], target_payload["protein_g"])
    assert target_payload["target_calories"] > 2000

    plan = client.post("/api/web/plan", json={"profile": PROFILE, "date": "2026-07-05"})
    assert plan.status_code == 200, plan.text
    plan_payload = plan.json()
    print("[web plan] meals=", len(plan_payload["meals"]), "calories=", plan_payload["total_calories"])
    assert len(plan_payload["meals"]) == 4

    grocery = client.post("/api/web/grocery", json={"profile": PROFILE, "date": "2026-07-05"})
    assert grocery.status_code == 200, grocery.text
    grocery_payload = grocery.json()
    print("[web grocery] items=", len(grocery_payload["items"]))
    assert len(grocery_payload["items"]) > 0

    advice = client.post(
        "/api/web/coach/advice",
        json={
            "profile": PROFILE,
            "date": "2026-07-05",
            "request": {
                "focus": "meal_strategy",
                "message": "I need a steadier meal schedule for workdays.",
            },
        },
    )
    assert advice.status_code == 200, advice.text
    advice_payload = advice.json()
    print("[web coach]", advice_payload["headline"], "score=", advice_payload["score"])
    assert advice_payload["headline"]
    assert advice_payload["next_actions"]

    print("WEB CHECKS PASSED ✅")


if __name__ == "__main__":
    main()
