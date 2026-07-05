"""EatFit FastAPI application entry point.

Run locally with:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import coach, plan, profiles, recipes
from app.seed import seed_recipes

app = FastAPI(
    title="EatFit API",
    description="AI 饮食管家后端:营养计算、个性化食谱、买菜清单、烹饪引导。",
    version="1.0.0",
)

# Allow the Android app (and Swagger UI) to call the API freely in dev.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profiles.router)
app.include_router(recipes.router)
app.include_router(plan.router)
app.include_router(coach.router)


@app.on_event("startup")
def on_startup():
    init_db()
    count = seed_recipes()
    print(f"[EatFit] Database ready. Recipes in library: {count}")


@app.get("/")
def root():
    return {
        "app": "EatFit API",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}
