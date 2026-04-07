"""
Doctor–patient care relationship (which patients a doctor may manage).
"""
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from .doctor import Doctor
from .patient import Patient


class CareRelationship(Document):
    """Links a doctor to a patient they are allowed to treat (prescribe for)."""

    doctor: Link[Doctor] = Field(...)
    patient: Link[Patient] = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "care_relationships"
        indexes = ["doctor", "patient"]
