"""
Refresh Token Model
Stores refresh tokens for JWT authentication
"""
from datetime import datetime, timedelta
from typing import Optional
from beanie import Document, Indexed, Link
from pydantic import Field
from .user import User
from app.config.settings import settings


class RefreshToken(Document):
    """
    Refresh Token Document Model
    Stores refresh tokens associated with users
    """
    
    # Link to User
    user: Link[User]
    
    # Token value (hashed)
    token_hash: Indexed(str, unique=True)
    
    # Expiration
    expires_at: datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    )
    
    # Status
    is_revoked: bool = Field(default=False, description="Whether token has been revoked")
    
    # Device/Browser info (optional, for security)
    device_info: Optional[str] = Field(None, description="Device/browser information")
    ip_address: Optional[str] = Field(None, description="IP address of the request")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_used_at: Optional[datetime] = Field(None, description="Last time token was used")
    
    class Settings:
        """Beanie Document Settings"""
        name = "refresh_tokens"  # Collection name in MongoDB
        indexes = [
            "user",
            "token_hash",
            "expires_at",
            "is_revoked",
            ("user", "is_revoked"),  # Composite index for efficient queries
        ]
        
    def is_expired(self) -> bool:
        """Check if token is expired"""
        return datetime.utcnow() > self.expires_at
    
    def is_valid(self) -> bool:
        """Check if token is valid (not revoked and not expired)"""
        return not self.is_revoked and not self.is_expired()
        
    def __repr__(self) -> str:
        return f"<RefreshToken {self.user} - {'valid' if self.is_valid() else 'invalid'}>"

