"""Pydantic schemas for materials"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MaterialUploadRequest(BaseModel):
    """Material upload request schema"""
    filename: str = Field(..., min_length=1, max_length=255)
    file_path: str = Field(..., min_length=1)
    file_size: int = Field(..., gt=0, le=52428800)  # Max 50MB
    mime_type: str = Field(..., min_length=1)
    material_id: str = Field(..., min_length=1)


class MaterialUploadResponse(BaseModel):
    """Material upload response schema"""
    materialId: str
    filename: str
    processingStatus: str


class MaterialStatusResponse(BaseModel):
    """Material status response schema"""
    id: str
    processing_status: str
    filename: str


class MaterialResponse(BaseModel):
    """Material response schema"""
    id: str
    notebook_id: str
    filename: str
    file_path: str
    file_size: int
    mime_type: str
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class MaterialListResponse(BaseModel):
    """List of materials response schema"""
    materials: list[MaterialResponse]
    total: int


class MessageResponse(BaseModel):
    """Message response schema"""
    id: str
    conversation_id: str
    role: str
    content: str
    citations: Optional[dict] = None
    grounding_score: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    """Conversation response schema"""
    id: str
    notebook_id: str
    created_at: datetime
    messages: list[MessageResponse]
    
    class Config:
        from_attributes = True


class ConversationListResponse(BaseModel):
    """List of conversations response schema"""
    conversations: list[ConversationResponse]
    total: int


class SearchResultResponse(BaseModel):
    """Search result response schema"""
    id: str
    type: str  # 'material' or 'message'
    title: str
    content: str
    highlight: str
    created_at: datetime


class SearchResponse(BaseModel):
    """Search response schema"""
    results: list[SearchResultResponse]
    total: int
    query: str
