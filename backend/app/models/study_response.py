"""Study response model"""
from sqlalchemy import Column, Text, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class StudyResponse(Base):
    """Study response model - user answers to quiz questions"""

    __tablename__ = "study_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("study_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    user_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    retry_count = Column(Integer, default=0, nullable=False)
    time_spent_seconds = Column(Integer, nullable=False)
    feedback_shown = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    question = relationship("StudyQuestion", back_populates="responses")
