"""Study Mode models"""
import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class QuestionType(str, enum.Enum):
    """Question type for study sessions"""
    MULTIPLE_CHOICE = "multiple_choice"
    SHORT_ANSWER = "short_answer"
    TRUE_FALSE = "true_false"


class StudySession(Base):
    """Study session model - quiz session for a notebook"""
    __tablename__ = "study_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    notebook_id = Column(UUID(as_uuid=True), ForeignKey("notebooks.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    question_count = Column(Integer, nullable=False)

    # Relationships
    notebook = relationship("Notebook", back_populates="study_sessions")
    questions = relationship("StudyQuestion", back_populates="session", cascade="all, delete-orphan", order_by="StudyQuestion.created_at")


class StudyQuestion(Base):
    """Study question model - individual question in a study session"""
    __tablename__ = "study_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("study_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(Enum(QuestionType), nullable=False)
    correct_answer = Column(Text, nullable=False)
    options = Column(JSONB, nullable=True)  # For multiple choice questions
    source_chunks = Column(JSONB, nullable=True)  # Array of chunk references
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    session = relationship("StudySession", back_populates="questions")
    responses = relationship("StudyResponse", back_populates="question", cascade="all, delete-orphan", order_by="StudyResponse.created_at")


class StudyResponse(Base):
    """Study response model - user's answer to a study question"""
    __tablename__ = "study_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("study_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    user_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    retry_count = Column(Integer, default=0, nullable=False)
    time_spent_seconds = Column(Integer, nullable=False)
    feedback_shown = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    question = relationship("StudyQuestion", back_populates="responses")
