"""Unit tests for LLM coach configuration and retry behavior."""
from __future__ import annotations

from types import SimpleNamespace

import httpx

from app.schemas import CoachFocus, CoachRequest, DailyPlanOut, NutritionTarget
from app.services import llm_coach


def _make_target() -> NutritionTarget:
    return NutritionTarget(
        bmr=1500,
        tdee=2100,
        target_calories=2100,
        protein_g=130,
        carbs_g=220,
        fat_g=65,
        explanation="test target",
    )


def _make_plan() -> DailyPlanOut:
    return DailyPlanOut(
        date="2026-07-12",
        profile_id=1,
        target=_make_target(),
        meals=[],
        total_calories=1860,
        total_protein_g=118,
        total_carbs_g=190,
        total_fat_g=58,
    )


def _make_profile() -> SimpleNamespace:
    return SimpleNamespace(
        name="小何",
        gender="male",
        age=30,
        height_cm=175,
        weight_kg=72,
        body_fat_pct=16,
        activity_level="moderate",
        goal="maintain",
        allergens=[],
        disliked_tags=[],
        diet_preference=None,
    )


def _make_success_response() -> dict:
    return {
        "choices": [
            {
                "message": {
                    "content": (
                        '{"focus":"daily_review","headline":"今日建议","summary":"先补足蛋白，再按训练安排主食。",'
                        '"score":88,"risk_alerts":["午后加餐偏少"],'
                        '"nutrition_insights":["蛋白略低于目标","总热量接近目标"],'
                        '"next_actions":["晚餐增加一份鱼虾","训练后补一份酸奶"],'
                        '"meal_strategy":["午餐保留主食","晚餐优先蛋白"],'
                        '"disclaimer":"ignore"}'
                    )
                }
            }
        ]
    }


class FakeResponse:
    def __init__(self, status_code: int, data: dict | None = None, text: str = ""):
        self.status_code = status_code
        self._data = data or {}
        self.text = text
        self.request = httpx.Request("POST", "https://example.com/chat/completions")

    def raise_for_status(self):
        if self.status_code >= 400:
            raise httpx.HTTPStatusError(
                f"{self.status_code} error",
                request=self.request,
                response=self,
            )

    def json(self):
        return self._data


class FakeClient:
    def __init__(self, scripted_responses: list[FakeResponse], call_log: list[dict]):
        self._scripted_responses = scripted_responses
        self._call_log = call_log

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def post(self, url: str, headers: dict, json: dict):
        self._call_log.append({"url": url, "headers": headers, "json": json})
        return self._scripted_responses.pop(0)


def test_resolve_llm_configs_prefers_project_default(monkeypatch):
    monkeypatch.delenv("EATFIT_LLM_BASE_URL", raising=False)
    monkeypatch.delenv("EATFIT_LLM_MODEL", raising=False)

    configs = llm_coach._resolve_llm_configs()

    assert [(item.name, item.base_url, item.model) for item in configs] == [
        ("ark-default", "https://ark.cn-beijing.volces.com/api/v3", "minimax-m3"),
        ("moonshot-legacy", "https://api.moonshot.cn/v1", "kimi-k2.7-code"),
    ]


def test_resolve_llm_configs_honors_explicit_env(monkeypatch):
    monkeypatch.setenv("EATFIT_LLM_BASE_URL", "https://example.com/v1/")
    monkeypatch.setenv("EATFIT_LLM_MODEL", "custom-model")

    configs = llm_coach._resolve_llm_configs()

    assert [(item.name, item.base_url, item.model) for item in configs] == [
        ("explicit-env", "https://example.com/v1", "custom-model")
    ]


def test_generate_coach_advice_retries_legacy_provider_when_default_fails(monkeypatch):
    monkeypatch.setenv("EATFIT_LLM_API_KEY", "test-key")
    monkeypatch.delenv("EATFIT_LLM_BASE_URL", raising=False)
    monkeypatch.delenv("EATFIT_LLM_MODEL", raising=False)

    call_log: list[dict] = []
    responses = [
        FakeResponse(401, text='{"error":"invalid ark key"}'),
        FakeResponse(200, data=_make_success_response()),
    ]

    monkeypatch.setattr(
        llm_coach.httpx,
        "Client",
        lambda timeout: FakeClient(responses, call_log),
    )

    result = llm_coach.generate_coach_advice(
        _make_profile(),
        _make_target(),
        _make_plan(),
        CoachRequest(message="我今天训练后有点饿", focus=CoachFocus.daily_review),
    )

    assert result.summary == "先补足蛋白，再按训练安排主食。"
    assert result.disclaimer == llm_coach.DISCLAIMER
    assert [call["url"] for call in call_log] == [
        "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
        "https://api.moonshot.cn/v1/chat/completions",
    ]
    assert [call["json"]["model"] for call in call_log] == ["minimax-m3", "kimi-k2.7-code"]
