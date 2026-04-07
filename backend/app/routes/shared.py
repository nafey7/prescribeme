"""
Shared routes accessible by multiple roles
"""
from datetime import datetime
from typing import Optional, Tuple
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.auth import get_current_user, require_roles
from app.models import User, Notification, Doctor, Patient
from app.schemas import NotificationResponse
from app.schemas.settings import (
    ProfileUpdateRequest,
    ChangePasswordRequest,
    SettingsResponse,
    SettingsPatchRequest,
    NotificationReadUpdate,
)
from app.utils.auth import hash_password, verify_password

router = APIRouter(prefix="/shared", tags=["shared"])


def _split_full_name(full_name: str) -> Tuple[str, str]:
    parts = (full_name or "").strip().split(None, 1)
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], parts[1]


async def _build_settings_response(user: User) -> SettingsResponse:
    fn, ln = _split_full_name(user.full_name)
    base = SettingsResponse(
        role=user.role,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        first_name=fn,
        last_name=ln,
    )
    if user.role == "doctor":
        doc = await Doctor.find_one(Doctor.user.id == user.id)
        if doc:
            await doc.fetch_all_links()
            return SettingsResponse(
                role=user.role,
                email=user.email,
                username=user.username,
                full_name=user.full_name,
                first_name=fn,
                last_name=ln,
                phone=doc.phone,
                specialty=doc.specialty,
                license_number=doc.license_number,
                clinic=doc.hospital,
                address=doc.practice_address,
            )
    if user.role == "patient":
        pat = await Patient.find_one(Patient.user.id == user.id)
        if pat:
            await pat.fetch_all_links()
            dob = pat.date_of_birth.isoformat() if pat.date_of_birth else None
            return SettingsResponse(
                role=user.role,
                email=user.email,
                username=user.username,
                full_name=user.full_name,
                first_name=fn,
                last_name=ln,
                phone=pat.phone,
                address=pat.address,
                gender=pat.gender,
                blood_type=pat.blood_type,
                date_of_birth=dob,
            )
    return base


@router.get("/notifications", response_model=list[NotificationResponse])
async def get_notifications(
    current_user: User = Depends(require_roles(["doctor", "patient"])),
    type_filter: Optional[str] = Query(None, alias="type"),
    unread_only: Optional[bool] = Query(False, alias="unread"),
):
    query = Notification.find(Notification.user.id == current_user.id)

    if unread_only:
        query = query.find(Notification.read == False)

    if type_filter and type_filter != "all":
        query = query.find(Notification.type == type_filter)

    notifications_docs = await query.sort(-Notification.timestamp).to_list()

    notifications = []
    for notif in notifications_docs:
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

        notifications.append(
            NotificationResponse(
                id=str(notif.id),
                type=notif.type,
                title=notif.title,
                description=notif.description,
                timestamp=timestamp,
                read=notif.read,
                priority=notif.priority,
                actionUrl=notif.action_url,
                actionLabel=notif.action_label,
            )
        )

    return notifications


@router.patch("/notifications/{notification_id}", response_model=NotificationResponse)
async def patch_notification(
    notification_id: str,
    body: NotificationReadUpdate,
    current_user: User = Depends(require_roles(["doctor", "patient"])),
):
    try:
        notif = await Notification.get(ObjectId(notification_id))
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    await notif.fetch_link(Notification.user)
    if not notif or notif.user.id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    notif.read = body.read
    notif.updated_at = datetime.utcnow()
    await notif.save()

    now = datetime.utcnow()
    diff = now - notif.timestamp
    if diff.days == 0:
        ts = f"{diff.seconds // 60} minutes ago" if diff.seconds < 3600 else f"{diff.seconds // 3600} hours ago"
    else:
        ts = f"{diff.days} days ago"

    return NotificationResponse(
        id=str(notif.id),
        type=notif.type,
        title=notif.title,
        description=notif.description,
        timestamp=ts,
        read=notif.read,
        priority=notif.priority,
        actionUrl=notif.action_url,
        actionLabel=notif.action_label,
    )


@router.post("/notifications/mark-all-read")
async def mark_all_notifications_read(
    current_user: User = Depends(require_roles(["doctor", "patient"])),
):
    unread = await Notification.find(
        Notification.user.id == current_user.id,
        Notification.read == False,
    ).to_list()
    now = datetime.utcnow()
    for n in unread:
        n.read = True
        n.updated_at = now
        await n.save()
    return {"message": "All notifications marked read"}


@router.delete("/notifications/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(require_roles(["doctor", "patient"])),
):
    try:
        notif = await Notification.get(ObjectId(notification_id))
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    await notif.fetch_link(Notification.user)
    if not notif or notif.user.id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    await notif.delete()


@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
    }


@router.patch("/profile")
async def patch_profile(
    body: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
):
    current_user.full_name = body.full_name.strip()
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
    }


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(require_roles(["doctor", "patient"])),
):
    if not verify_password(body.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    current_user.password_hash = hash_password(body.new_password)
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    return {"message": "Password updated successfully"}


@router.get("/settings", response_model=SettingsResponse)
async def get_settings(
    current_user: User = Depends(require_roles(["doctor", "patient"])),
):
    return await _build_settings_response(current_user)


@router.patch("/settings", response_model=SettingsResponse)
async def patch_settings(
    body: SettingsPatchRequest,
    current_user: User = Depends(require_roles(["doctor", "patient"])),
):
    data = body.model_dump(exclude_unset=True)
    if "full_name" in data and data["full_name"]:
        current_user.full_name = data["full_name"].strip()
        current_user.updated_at = datetime.utcnow()
        await current_user.save()

    if current_user.role == "doctor":
        doc = await Doctor.find_one(Doctor.user.id == current_user.id)
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor profile not found")
        if "specialty" in data and data["specialty"] is not None:
            doc.specialty = data["specialty"]
        if "hospital" in data and data["hospital"] is not None:
            doc.hospital = data["hospital"]
        if "license_number" in data:
            doc.license_number = data["license_number"]
        if "phone" in data:
            doc.phone = data["phone"]
        if "practice_address" in data:
            doc.practice_address = data["practice_address"]
        doc.updated_at = datetime.utcnow()
        await doc.save()

    elif current_user.role == "patient":
        pat = await Patient.find_one(Patient.user.id == current_user.id)
        if not pat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")
        if "phone" in data:
            pat.phone = data["phone"]
        if "address" in data:
            pat.address = data["address"]
        if "gender" in data:
            pat.gender = data["gender"]
        if "blood_type" in data:
            pat.blood_type = data["blood_type"]
        if "date_of_birth" in data and data["date_of_birth"]:
            from datetime import date as date_type

            try:
                y, m, d = data["date_of_birth"].split("-")
                pat.date_of_birth = date_type(int(y), int(m), int(d))
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="date_of_birth must be YYYY-MM-DD",
                )
        pat.updated_at = datetime.utcnow()
        await pat.save()

    return await _build_settings_response(current_user)
