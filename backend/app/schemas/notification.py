"""
Notification response schemas
"""
from typing import Optional
from pydantic import BaseModel


class NotificationResponse(BaseModel):
    """Notification response"""
    id: str
    type: str  # prescription, appointment, system, message
    title: str
    description: str
    timestamp: str
    read: bool
    priority: str  # low, medium, high
    actionUrl: Optional[str] = None
    actionLabel: Optional[str] = None

