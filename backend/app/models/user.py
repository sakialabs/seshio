"""User model"""
import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class UserArchetype(str, enum.Enum):
    """User archetype for learning style"""
    STRUCTURED = "structured"
    DEEP_WORKER = "deep_worker"
    EXPLORER = "explorer"


class User(Base):
    """User model - managed by Supabase Auth"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    archetype = Column(Enum(UserArchetype), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    notebooks = relationship("Notebook", back_populates="user", cascade="all, delete-orphan")
    experiments = relationship("Experiment", back_populates="user", cascade="all, delete-orphan")
