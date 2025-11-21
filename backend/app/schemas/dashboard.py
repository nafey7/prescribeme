"""
Dashboard response schemas
"""
from typing import List
from pydantic import BaseModel
from .prescription import ActivePrescriptionResponse
from .appointment import AppointmentResponse


class ActivityResponse(BaseModel):
    """Recent activity response"""
    id: str
    type: str  # prescription, appointment, test
    title: str
    description: str
    timestamp: str
    icon: str


class PatientDashboardResponse(BaseModel):
    """Patient dashboard response"""
    activePrescriptions: List[ActivePrescriptionResponse] = []
    upcomingAppointments: List[AppointmentResponse] = []
    recentActivity: List[ActivityResponse] = []
    stats: dict  # Contains counts for active prescriptions, appointments, doctors, lab results

