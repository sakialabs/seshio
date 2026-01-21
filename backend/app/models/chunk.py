"""Chunk model"""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
import uuid

from app.db.base import Base


class Chunk(Base):
    """Chunk model - text segments with embeddings for retrieval"""
    __tablename__ = "chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(768), nullable=True)  # Gemini embedding dimension
    chunk_index = Column(Integer, nullable=False)
    chunk_metadata = Column("metadata", JSONB, nullable=True)  # page_number, section_header, etc.
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    material = relationship("Material", back_populates="chunks")

    # Index for vector similarity search
    __table_args__ = (
        # Will be created in migration with: CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops)
    )
