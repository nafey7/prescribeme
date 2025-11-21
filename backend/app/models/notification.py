"""
Notification Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .user import User


class Notification(Document):
    """
    Notification Document Model
    Represents a notification for a user
    """
    
    # Relationships
    user: Link[User] = Field(..., description="User who receives the notification")
    
    # Notification Details
    type: str = Field(
        ...,
        description="Notification type: prescription, appointment, system, message"
    )
    title: str = Field(..., description="Notification title")
    description: str = Field(..., description="Notification description")
    
    # Status
    read: bool = Field(default=False, description="Whether notification has been read")
    priority: str = Field(default="medium", description="Priority: low, medium, or high")
    
    # Action
    action_url: Optional[str] = Field(None, description="URL for action button")
    action_label: Optional[str] = Field(None, description="Label for action button")
    
    # Timestamps
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Notification timestamp")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "notifications"  # Collection name in MongoDB
        indexes = [
            "user",
            "read",
            "type",
            "priority",
            "timestamp",
        ]
        
    def __repr__(self) -> str:
        return f"<Notification {self.type} for {self.user}>"

