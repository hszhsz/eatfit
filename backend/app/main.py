"""EatFit FastAPI application entry point.

Run locally with:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import coach, plan, profiles, recipes, web
from app.seed import seed_recipes

app = FastAPI(
    title="EatFit API",
    description="AI 饮食管家后端:营养计算、个性化食谱、买菜清单、烹饪引导。",
    version="1.0.0",
)

# Allow the web frontend, Android app, and local dev to call the API.
_ALLOWED_ORIGINS = [
    "https://web-iota-beige-57.vercel.app",
    "https://web-84hacftff-jackhes-projects-5ded530b.vercel.app",
    "https://web-gw2xbfvo1-jackhes-projects-5ded530b.vercel.app",
    "http://localhost:5173",
    "http://localhost:3210",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3210",
    "*",  # also allow any origin (mobile app, etc.)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profiles.router)
app.include_router(recipes.router)
app.include_router(plan.router)
app.include_router(coach.router)
app.include_router(web.router)


def _bootstrap():
    """Create tables and seed recipes. Called at import time for serverless."""
    init_db()
    count = seed_recipes()
    print(f"[EatFit] Database ready. Recipes in library: {count}")


# In serverless (Vercel) there are no startup events; initialise eagerly.
if os.getenv("VERCEL"):
    _bootstrap()


@app.on_event("startup")
def on_startup():
    if not os.getenv("VERCEL"):
        _bootstrap()


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
