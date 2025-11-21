"""
Appointment Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .patient import Patient
from .doctor import Doctor


class Appointment(Document):
    """
    Appointment Document Model
    Represents an appointment between a patient and doctor
    """
    
    # Relationships
    patient: Link[Patient] = Field(..., description="Patient for the appointment")
    doctor: Link[Doctor] = Field(..., description="Doctor for the appointment")
    
    # Appointment Details
    date: datetime = Field(..., description="Appointment date and time")
    type: str = Field(..., description="Appointment type (e.g., 'Follow-up', 'Consultation', 'Check-up')")
    status: str = Field(
        default="upcoming",
        description="Status: upcoming, confirmed, completed, cancelled"
    )
    
    # Additional Information
    notes: Optional[str] = Field(None, description="Appointment notes")
    duration_minutes: int = Field(default=30, description="Appointment duration in minutes")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "appointments"  # Collection name in MongoDB
        indexes = [
            "patient",
            "doctor",
            "date",
            "status",
        ]
        
    def __repr__(self) -> str:
        return f"<Appointment {self.date} - {self.patient} with {self.doctor}>"

