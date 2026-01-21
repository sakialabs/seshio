"""Study session model"""
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class StudySession(Base):
    """Study session model - quiz session container"""

    __tablename__ = "study_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    notebook_id = Column(UUID(as_uuid=True), ForeignKey("notebooks.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    question_count = Column(Integer, nullable=False)

    # Relationships
    notebook = relationship("Notebook", back_populates="study_sessions")
    questions = relationship("StudyQuestion", back_populates="session", cascade="all, delete-orphan")
