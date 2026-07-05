"""Vercel serverless entry point.

Vercel looks for `api/index.py` (or `api/index.handler`) and mounts it as a
serverless function. We simply re-export the FastAPI app so Vercel's ASGI
runner can pick it up.
"""
from app.main import app

# Vercel expects a callable named `app` (ASGI) or `handler` (WSGI).
# FastAPI apps are ASGI, so `app` is sufficient.
