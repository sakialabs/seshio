"""Pydantic schemas for authentication"""
from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserResponse(BaseModel):
    """User data response schema"""
    id: str
    email: str
    archetype: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class SignUpRequest(BaseModel):
    """Sign up request schema"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class SignInRequest(BaseModel):
    """Sign in request schema"""
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Authentication response schema"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: str
    user: UserResponse


class UpdateArchetypeRequest(BaseModel):
    """Update user archetype request"""
    archetype: str = Field(..., pattern="^(structured|deep_worker|explorer)$")


class PasswordResetRequest(BaseModel):
    """Password reset request schema"""
    email: EmailStr


class PasswordUpdateRequest(BaseModel):
    """Password update request schema"""
    password: str = Field(..., min_length=8, max_length=128)


class TokenRefreshRequest(BaseModel):
    """Token refresh request schema"""
    refresh_token: str
