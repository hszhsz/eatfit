"""EatFit FastAPI application — stateless nutrition engine.

Architecture:
- Recipes: static in-memory store (seed data, no DB needed)
- Profiles: frontend persists to Supabase; backend receives via POST
- Plans/Grocery/Coach: computed on-the-fly from POST body
- LLM Coach: optional, falls back to local heuristic if no API key
"""
from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.recipe_store import get_all_recipes
from app.routers import recipes, web


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Pre-load recipes on startup so first request is fast
    count = len(get_all_recipes())
    print(f"[EatFit] Recipe store ready: {count} recipes loaded.")

    api_key = os.getenv("EATFIT_LLM_API_KEY")
    if not api_key:
        print("[EatFit] WARNING: EATFIT_LLM_API_KEY not set — AI Coach will use local fallback.")
    else:
        print("[EatFit] LLM API key detected — AI Coach will use live model.")

    yield


app = FastAPI(
    title="EatFit API",
    description="AI 饮食管家后端：营养计算、个性化食谱、买菜清单、烹饪引导。",
    version="1.1.0",
    lifespan=lifespan,
)

# CORS — explicit origins only (no wildcard + credentials, which is invalid)
_ALLOWED_ORIGINS = [
    "https://web-iota-beige-57.vercel.app",
    "https://web-84hacftff-jackhes-projects-5ded530b.vercel.app",
    "https://web-gw2xbfvo1-jackhes-projects-5ded530b.vercel.app",
    "http://localhost:5173",
    "http://localhost:3210",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3210",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_origin_regex=r"https://web-.*\.vercel\.app",  # allow Vercel preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Only register routers that the frontend actually uses
app.include_router(recipes.router)
app.include_router(web.router)


@app.get("/")
def root():
    return {
        "app": "EatFit API",
        "version": "1.1.0",
        "status": "ok",
        "docs": "/docs",
        "recipes": len(get_all_recipes()),
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}
