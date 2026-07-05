"""SQLAlchemy ORM models and database session setup."""
from __future__ import annotations

import json
from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker

import os

# On Vercel (serverless) we use an in-memory SQLite DB that is re-seeded
# on every cold start. Locally we still use a file-based DB for convenience.
_IS_VERCEL = os.getenv("VERCEL") is not None

if _IS_VERCEL:
    DATABASE_URL = "sqlite:///:memory:"
else:
    DATABASE_URL = "sqlite:///./eatfit.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def _dumps(value) -> str:
    return json.dumps(value, ensure_ascii=False)


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    body_fat_pct = Column(Float, nullable=True)
    activity_level = Column(String, nullable=False, default="sedentary")
    goal = Column(String, nullable=False, default="maintain")
    allergens_json = Column(Text, nullable=False, default="[]")
    disliked_tags_json = Column(Text, nullable=False, default="[]")
    diet_preference = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # convenience accessors
    @property
    def allergens(self):
        return json.loads(self.allergens_json or "[]")

    @allergens.setter
    def allergens(self, value):
        self.allergens_json = _dumps(value or [])

    @property
    def disliked_tags(self):
        return json.loads(self.disliked_tags_json or "[]")

    @disliked_tags.setter
    def disliked_tags(self, value):
        self.disliked_tags_json = _dumps(value or [])


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    meal_type = Column(String, nullable=False, index=True)
    calories = Column(Float, nullable=False)
    protein_g = Column(Float, nullable=False)
    carbs_g = Column(Float, nullable=False)
    fat_g = Column(Float, nullable=False)
    tags_json = Column(Text, nullable=False, default="[]")
    allergens_json = Column(Text, nullable=False, default="[]")
    cook_minutes = Column(Integer, nullable=False, default=15)
    ingredients_json = Column(Text, nullable=False, default="[]")
    steps_json = Column(Text, nullable=False, default="[]")
    image_emoji = Column(String, nullable=False, default="🍽️")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
