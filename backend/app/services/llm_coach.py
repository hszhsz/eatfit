"""LLM-backed nutrition coaching for EatFit."""
from __future__ import annotations

import json
import os
from typing import Any

import httpx

from app.schemas import CoachFocus, CoachRequest, CoachResponse, DailyPlanOut, NutritionTarget


DEFAULT_BASE_URL = "https://api.moonshot.cn/v1"
DEFAULT_MODEL = "kimi-k2.7-code"
DISCLAIMER = "建议仅作饮食管理参考，存在慢病、孕期或特殊医疗情况时应咨询医生或注册营养师。"


def _goal_label(goal: str) -> str:
    return {
        "lose_fat": "减脂",
        "maintain": "保持",
        "gain_muscle": "增肌",
    }.get(goal, goal)


def _focus_label(focus: CoachFocus) -> str:
    return {
        CoachFocus.daily_review: "今日复盘",
        CoachFocus.meal_strategy: "下一餐策略",
        CoachFocus.eating_out: "外食选择",
        CoachFocus.cravings: "嘴馋管理",
    }[focus]


def _plan_payload(plan: DailyPlanOut) -> dict[str, Any]:
    return {
        "date": plan.date,
        "target": {
            "calories": round(plan.target.target_calories, 1),
            "protein_g": round(plan.target.protein_g, 1),
            "carbs_g": round(plan.target.carbs_g, 1),
            "fat_g": round(plan.target.fat_g, 1),
        },
        "actual": {
            "calories": round(plan.total_calories, 1),
            "protein_g": round(plan.total_protein_g, 1),
            "carbs_g": round(plan.total_carbs_g, 1),
            "fat_g": round(plan.total_fat_g, 1),
        },
        "meals": [
            {
                "meal_type": meal.meal_type.value,
                "name": meal.recipe.name,
                "calories": round(meal.recipe.calories, 1),
                "protein_g": round(meal.recipe.protein_g, 1),
                "carbs_g": round(meal.recipe.carbs_g, 1),
                "fat_g": round(meal.recipe.fat_g, 1),
                "tags": meal.recipe.tags,
            }
            for meal in plan.meals
        ],
    }


def _build_prompt(profile: Any, target: NutritionTarget, plan: DailyPlanOut, request: CoachRequest,
                     conversation_history: list[dict] | None = None) -> tuple[str, str]:
    system_prompt = (
        "你是 EatFit 的首席 AI 营养顾问，具备注册营养师级别的表达风格。"
        "你必须只输出 JSON，不要输出 markdown、解释文字或代码块。"
        "内容必须使用简体中文，语气专业、克制、可执行。"
        "请结合用户目标、体测、今日推荐食谱、用户补充说明和之前的对话历史给出建议。"
        "如果用户在追问之前的话题，请结合对话历史给出连贯的回答。"
        "输出 JSON 结构必须严格包含以下字段："
        '{"focus":"daily_review|meal_strategy|eating_out|cravings",'
        '"headline":"一句标题",'
        '"summary":"80字内总结",'
        '"score":0,'
        '"risk_alerts":["最多3条"],'
        '"nutrition_insights":["2到4条"],'
        '"next_actions":["2到4条"],'
        '"meal_strategy":["2到4条"],'
        f'"disclaimer":"{DISCLAIMER}"}}'
        "评分规则：90-100 非常稳健，75-89 基本达标，60-74 有明显偏差，0-59 风险较高。"
        "所有条目必须具体，不要重复，不要写空数组以外的 null。"
        "严格控制长度：summary 不超过 60 个汉字；每个数组最多 3 条；每条不超过 28 个汉字；总输出控制在 650 个汉字内。"
    )
    user_data = {
        "focus": request.focus.value,
        "focus_label": _focus_label(request.focus),
        "user_message": request.message or "请先给我做一份今日饮食管理简报，并指出最该优先优化的一件事。",
        "profile": {
            "name": profile.name,
            "gender": profile.gender,
            "age": profile.age,
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "body_fat_pct": profile.body_fat_pct,
            "activity_level": profile.activity_level,
            "goal": profile.goal,
            "goal_label": _goal_label(profile.goal),
            "allergens": profile.allergens,
            "disliked_tags": profile.disliked_tags,
            "diet_preference": profile.diet_preference,
        },
        "target_explanation": target.explanation,
        "plan": _plan_payload(plan),
    }
    # Include conversation history for multi-turn context
    if conversation_history:
        user_data["conversation_history"] = conversation_history[-10:]  # last 10 messages max
    user_prompt = json.dumps(user_data, ensure_ascii=False)
    return system_prompt, user_prompt


def _extract_text(data: dict[str, Any]) -> str:
    # OpenAI-compatible Chat Completions response format
    choices = data.get("choices", [])
    if choices:
        content = choices[0].get("message", {}).get("content", "")
        if isinstance(content, str) and content.strip():
            return content.strip()
    # Fallback: Responses API format (Volcano/Doubao legacy)
    if isinstance(data.get("output_text"), str) and data["output_text"].strip():
        return data["output_text"].strip()
    texts: list[str] = []
    for item in data.get("output", []):
        for content in item.get("content", []):
            text = content.get("text")
            if isinstance(text, str) and text.strip():
                texts.append(text.strip())
    return "\n".join(texts).strip()


def _extract_json_block(text: str) -> str:
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("LLM 返回中未找到 JSON 对象")
    return text[start : end + 1]


def _local_fallback(profile: Any, plan: DailyPlanOut, request: CoachRequest) -> CoachResponse:
    calorie_gap = round(plan.target.target_calories - plan.total_calories)
    protein_gap = round(plan.target.protein_g - plan.total_protein_g)
    risk_alerts: list[str] = []
    if calorie_gap > 250:
        risk_alerts.append("当前推荐总热量低于目标较多，容易在晚间出现额外进食冲动。")
    if protein_gap > 20:
        risk_alerts.append("蛋白质摄入与目标仍有差距，饱腹感和恢复质量可能不足。")
    if not risk_alerts:
        risk_alerts.append("当前日计划整体结构平衡，重点放在执行稳定性和进餐节奏。")

    return CoachResponse(
        focus=request.focus,
        headline=f"{profile.name}的{_focus_label(request.focus)}建议",
        summary=f"围绕{_goal_label(profile.goal)}目标，先确保蛋白质达标，再根据饥饿感微调主食和加餐。",
        score=82 if calorie_gap <= 250 and protein_gap <= 20 else 71,
        risk_alerts=risk_alerts[:3],
        nutrition_insights=[
            f"今日计划热量约 {int(plan.total_calories)} kcal，目标约 {int(plan.target.target_calories)} kcal。",
            f"蛋白质约 {int(plan.total_protein_g)} g，距离目标约 {max(protein_gap, 0)} g。",
            "三餐结构已具备基础平衡，真正影响结果的是执行一致性。",
        ],
        next_actions=[
            "下一餐优先补足优质蛋白，例如鸡胸、鱼虾、无糖酸奶或豆制品。",
            "若训练后饥饿明显，可增加一份高蛋白加餐，而不是直接加高糖零食。",
            "把饮水和进餐时间固定下来，减少随机进食。",
        ],
        meal_strategy=[
            "外食时先选蛋白主菜，再决定主食分量。",
            "若今天活动量偏低，晚餐主食可比午餐少半份。",
            "若出现嘴馋，先用酸奶、水果或高蛋白零食替代。",
        ],
        disclaimer=DISCLAIMER,
    )


def generate_coach_advice(profile: Any, target: NutritionTarget, plan: DailyPlanOut, request: CoachRequest,
                            conversation_history: list[dict] | None = None) -> CoachResponse:
    api_key = os.getenv("EATFIT_LLM_API_KEY")
    if not api_key:
        return _local_fallback(profile, plan, request)

    system_prompt, user_prompt = _build_prompt(profile, target, plan, request, conversation_history)
    base_url = os.getenv("EATFIT_LLM_BASE_URL", DEFAULT_BASE_URL).rstrip("/")
    model = os.getenv("EATFIT_LLM_MODEL", DEFAULT_MODEL)

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.4,
        "max_tokens": 6000,
    }

    try:
        with httpx.Client(timeout=90.0) as client:
            response = client.post(
                f"{base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

        text = _extract_text(data)
        raw_json = _extract_json_block(text)
        parsed = CoachResponse.model_validate_json(raw_json)
        return parsed.model_copy(update={"disclaimer": DISCLAIMER})
    except Exception:
        return _local_fallback(profile, plan, request)
