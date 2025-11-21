"""
Doctor response schemas
"""
from typing import List, Optional
from pydantic import BaseModel


class DoctorListItemResponse(BaseModel):
    """Doctor list item response"""
    id: str
    name: str
    specialty: str
    rating: float
    reviewCount: int
    experience: int
    hospital: str
    availability: Optional[str] = None
    acceptingNewPatients: bool
    languages: List[str] = []
    distance: Optional[str] = None

