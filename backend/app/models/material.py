"""Material model"""
import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class ProcessingStatus(str, enum.Enum):
    """Material processing status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Material(Base):
    """Material model - uploaded learning content"""
    __tablename__ = "materials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    notebook_id = Column(UUID(as_uuid=True), ForeignKey("notebooks.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)  # Supabase storage reference
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    processing_status = Column(Enum(ProcessingStatus), default=ProcessingStatus.PENDING, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    notebook = relationship("Notebook", back_populates="materials")
    chunks = relationship("Chunk", back_populates="material", cascade="all, delete-orphan")
