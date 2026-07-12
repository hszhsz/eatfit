"""Clerk JWT authentication for FastAPI.

Verifies Clerk session tokens and extracts the Clerk user ID (sub claim).
Uses Clerk's JWKS endpoint for token verification.
"""
from __future__ import annotations

import json
import os
import time
from functools import lru_cache
from typing import Optional

import httpx
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Clerk publishes JWKS at https://<your-clerk-domain>/.well-known/jwks.json
# The domain can be derived from the publishable key or JWT iss claim.
_CLERK_JWKS_CACHE: dict = {}
_CLERK_JWKS_CACHE_TIME: float = 0
_JWKS_CACHE_TTL = 3600  # 1 hour


security = HTTPBearer(auto_error=False)


def _clerk_domain_from_key(publishable_key: str) -> str:
    """Derive the Clerk frontend domain from a publishable key."""
    # pk_live_xxx → clerk.xxx.clerk.accounts.dev pattern
    # pk_test_xxx → clerk.xxx.clerk.accounts.dev pattern
    # The key contains the domain info; fall back to env var
    if not publishable_key:
        return ""
    # For Clerk-hosted: extract from key pattern
    # Actually, the simplest is to use the JWT 'iss' claim directly
    return ""


def _get_jwks(jwks_url: str) -> dict:
    """Fetch Clerk JWKS with in-memory cache."""
    global _CLERK_JWKS_CACHE, _CLERK_JWKS_CACHE_TIME
    now = time.time()
    if _CLERK_JWKS_CACHE and (now - _CLERK_JWKS_CACHE_TIME) < _JWKS_CACHE_TTL:
        return _CLERK_JWKS_CACHE
    try:
        resp = httpx.get(jwks_url, timeout=10.0)
        resp.raise_for_status()
        _CLERK_JWKS_CACHE = resp.json()
        _CLERK_JWKS_CACHE_TIME = now
        return _CLERK_JWKS_CACHE
    except Exception as e:
        if _CLERK_JWKS_CACHE:
            # Return stale cache on fetch failure
            return _CLERK_JWKS_CACHE
        raise HTTPException(status_code=503, detail=f"Cannot fetch Clerk JWKS: {e}")


def verify_clerk_token(token: str) -> dict:
    """Verify a Clerk JWT and return its decoded claims.

    Raises HTTPException(401) if the token is invalid or expired.
    """
    try:
        from python_jose import jwt, jwk, JWTError
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="python-jose not installed. Run: pip install python-jose[cryptography]",
        )

    # Step 1: Decode header to get kid
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid JWT header: {e}")

    kid = unverified_header.get("kid")
    if not kid:
        raise HTTPException(status_code=401, detail="JWT missing kid in header")

    # Step 2: Decode payload without verification to get iss
    try:
        unverified_payload = jwt.get_unverified_claims(token)
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid JWT payload: {e}")

    iss = unverified_payload.get("iss", "")
    if not iss:
        raise HTTPException(status_code=401, detail="JWT missing iss claim")

    # Build JWKS URL from iss
    jwks_url = f"{iss.rstrip('/')}/.well-known/jwks.json"

    # Step 3: Fetch JWKS and find the matching key
    jwks = _get_jwks(jwks_url)
    keys = jwks.get("keys", [])
    key_data = None
    for k in keys:
        if k.get("kid") == kid:
            key_data = k
            break

    if not key_data:
        raise HTTPException(
            status_code=401,
            detail=f"No matching JWK found for kid={kid}. Keys available: {[k.get('kid') for k in keys]}",
        )

    # Step 4: Convert JWK to PEM and verify
    try:
        public_key = jwk.construct(key_data)
        payload = jwt.decode(token, public_key, algorithms=["RS256"],
                            audience=unverified_payload.get("aud"),
                            options={"verify_exp": True})
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"JWT verification failed: {e}")

    return payload


async def get_clerk_user_id(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> str:
    """FastAPI dependency: extract Clerk user ID from JWT.

    Usage:
        @app.get("/api/profile")
        async def get_profile(user_id: str = Depends(get_clerk_user_id)):
            ...
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header required")

    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Empty token")

    try:
        payload = verify_clerk_token(token)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification error: {e}")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="JWT missing sub claim")

    return sub
