"""
One-time password reset token stored hashed.
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .user import User


class PasswordResetToken(Document):
    user: Link[User] = Field(...)
    token_hash: str = Field(...)
    expires_at: datetime = Field(...)
    used_at: Optional[datetime] = Field(default=None)

    class Settings:
        name = "password_reset_tokens"
        indexes = ["token_hash", "user"]
