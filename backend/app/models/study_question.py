"""Study question model"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base import Base


class QuestionType(str, enum.Enum):
    """Question type enum"""

    MULTIPLE_CHOICE = "multiple_choice"
    SHORT_ANSWER = "short_answer"
    TRUE_FALSE = "true_false"


class StudyQuestion(Base):
    """Study question model - individual quiz questions"""

    __tablename__ = "study_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("study_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(SQLEnum(QuestionType), nullable=False)
    correct_answer = Column(Text, nullable=False)
    options = Column(JSONB, nullable=True)  # For multiple choice
    source_chunks = Column(JSONB, nullable=True)  # Array of chunk references
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    session = relationship("StudySession", back_populates="questions")
    responses = relationship("StudyResponse", back_populates="question", cascade="all, delete-orphan")
