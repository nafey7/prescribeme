"""
Appointment response schemas
"""
from typing import Optional
from pydantic import BaseModel


class AppointmentResponse(BaseModel):
    """Appointment response"""
    id: str
    doctor: str
    specialty: str
    date: str
    time: str
    type: str
    status: str  # upcoming, confirmed, completed, cancelled

