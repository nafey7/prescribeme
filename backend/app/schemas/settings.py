"""
Profile, settings, and password change schemas.
"""
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class ProfileUpdateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=100)


class DoctorSettingsUpdateRequest(BaseModel):
    specialty: Optional[str] = Field(None, min_length=1, max_length=120)
    hospital: Optional[str] = Field(None, min_length=1, max_length=200)
    license_number: Optional[str] = Field(None, max_length=80)
    phone: Optional[str] = Field(None, max_length=40)
    practice_address: Optional[str] = Field(None, max_length=500)


class PatientSettingsUpdateRequest(BaseModel):
    phone: Optional[str] = Field(None, max_length=40)
    address: Optional[str] = Field(None, max_length=500)
    gender: Optional[str] = Field(None, max_length=40)
    blood_type: Optional[str] = Field(None, max_length=10)
    date_of_birth: Optional[str] = Field(None, description="ISO date YYYY-MM-DD")


class SettingsPatchRequest(BaseModel):
    """Optional fields for PATCH /shared/settings (role-specific fields ignored if not applicable)."""

    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    specialty: Optional[str] = Field(None, min_length=1, max_length=120)
    hospital: Optional[str] = Field(None, min_length=1, max_length=200)
    license_number: Optional[str] = Field(None, max_length=80)
    phone: Optional[str] = Field(None, max_length=40)
    practice_address: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, max_length=500)
    gender: Optional[str] = Field(None, max_length=40)
    blood_type: Optional[str] = Field(None, max_length=10)
    date_of_birth: Optional[str] = Field(None, description="ISO date YYYY-MM-DD")


class SettingsResponse(BaseModel):
    role: str
    email: str
    username: str
    full_name: str
    first_name: str = ""
    last_name: str = ""
    phone: Optional[str] = None
    specialty: Optional[str] = None
    license_number: Optional[str] = None
    clinic: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=10)
    new_password: str = Field(..., min_length=8, max_length=100)


class NotificationReadUpdate(BaseModel):
    read: bool = True
