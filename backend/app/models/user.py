from beanie import Document, Indexed
from pydantic import Field, EmailStr
from datetime import datetime
from typing import Optional


class User(Document):
    """User model for authentication and profile management."""

    email: EmailStr = Field(..., index=True, unique=True)
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        collection = "users"
