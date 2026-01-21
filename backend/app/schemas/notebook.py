"""Pydantic schemas for notebooks"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class NotebookCreateRequest(BaseModel):
    """Create notebook request schema"""
    name: str = Field(..., min_length=1, max_length=255, description="Notebook name")


class NotebookUpdateRequest(BaseModel):
    """Update notebook request schema"""
    name: str = Field(..., min_length=1, max_length=255, description="Notebook name")


class NotebookResponse(BaseModel):
    """Notebook response schema"""
    id: str
    user_id: str
    name: str
    created_at: datetime
    updated_at: datetime
    material_count: Optional[int] = None
    message_count: Optional[int] = None
    
    class Config:
        from_attributes = True


class NotebookListResponse(BaseModel):
    """List of notebooks response schema"""
    notebooks: list[NotebookResponse]
    total: int
