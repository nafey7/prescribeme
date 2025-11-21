"""
Patient response schemas
"""
from typing import Optional, List
from pydantic import BaseModel


class PatientListItemResponse(BaseModel):
    """Patient list item response for doctor view"""
    id: str
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    email: str
    phone: Optional[str] = None
    lastVisit: Optional[str] = None
    status: str  # active, inactive
    conditions: List[str] = []


class PatientProfileResponse(BaseModel):
    """Detailed patient profile response"""
    id: str
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    bloodType: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    lastVisit: Optional[str] = None
    status: str

