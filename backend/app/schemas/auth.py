"""
Authentication request/response schemas
"""
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SignUpRequest(BaseModel):
    """Sign up request schema"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)
    role: str = Field(..., pattern="^(patient|doctor)$", description="User role: patient or doctor")


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: dict  # User information


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema (token comes from cookie, but we include it for validation)"""
    pass


class UserResponse(BaseModel):
    """User information response"""
    id: str
    email: str
    username: str
    full_name: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: str

