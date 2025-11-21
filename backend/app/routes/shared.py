"""
Shared routes accessible by multiple roles

These routes can be accessed by both doctors and patients (or other roles).
Use the require_roles dependency to specify which roles can access each route.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.dependencies.auth import get_current_user, require_roles
from app.models import User, Notification
from app.schemas import NotificationResponse

router = APIRouter(prefix="/shared", tags=["shared"])


@router.get("/notifications", response_model=list[NotificationResponse])
async def get_notifications(
    current_user: User = Depends(require_roles(["doctor", "patient"])),
    type_filter: Optional[str] = Query(None, alias="type"),
    unread_only: Optional[bool] = Query(False, alias="unread")
):
    """
    Get user notifications (accessible by doctors and patients)
    
    Requires: Doctor or Patient role
    """
    query = Notification.find(Notification.user.id == current_user.id)
    
    if unread_only:
        query = query.find(Notification.read == False)
    
    if type_filter and type_filter != "all":
        query = query.find(Notification.type == type_filter)
    
    notifications_docs = await query.sort(-Notification.timestamp).to_list()
    
    notifications = []
    for notif in notifications_docs:
        # Format timestamp as relative time
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        diff = now - notif.timestamp
        
        if diff.days == 0:
            if diff.seconds < 3600:
                timestamp = f"{diff.seconds // 60} minute{'s' if diff.seconds // 60 != 1 else ''} ago"
            else:
                timestamp = f"{diff.seconds // 3600} hour{'s' if diff.seconds // 3600 != 1 else ''} ago"
        elif diff.days == 1:
            timestamp = "1 day ago"
        elif diff.days < 7:
            timestamp = f"{diff.days} days ago"
        elif diff.days < 30:
            weeks = diff.days // 7
            timestamp = f"{weeks} week{'s' if weeks != 1 else ''} ago"
        else:
            timestamp = f"{diff.days // 30} month{'s' if diff.days // 30 != 1 else ''} ago"
        
        notifications.append(NotificationResponse(
            id=str(notif.id),
            type=notif.type,
            title=notif.title,
            description=notif.description,
            timestamp=timestamp,
            read=notif.read,
            priority=notif.priority,
            actionUrl=notif.action_url,
            actionLabel=notif.action_label,
        ))
    
    return notifications


@router.get("/profile")
async def get_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get user profile (accessible by any authenticated user)
    
    Requires: Any authenticated user (no specific role required)
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
    }


@router.get("/settings")
async def get_settings(
    current_user: User = Depends(require_roles(["doctor", "patient"]))
):
    """
    Get user settings (accessible by doctors and patients)
    
    Requires: Doctor or Patient role
    """
    # TODO: Implement settings logic
    return {
        "message": "User settings",
        "user_id": str(current_user.id),
        "role": current_user.role,
        "settings": {}
    }

