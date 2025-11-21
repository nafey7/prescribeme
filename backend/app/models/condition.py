"""
Medical Condition Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .patient import Patient
from .doctor import Doctor


class Condition(Document):
    """
    Medical Condition Document Model
    Represents a medical condition diagnosed for a patient
    """
    
    # Relationships
    patient: Link[Patient] = Field(..., description="Patient with this condition")
    doctor: Link[Doctor] = Field(..., description="Doctor who diagnosed the condition")
    
    # Condition Details
    name: str = Field(..., description="Condition name (e.g., 'Hypertension', 'Type 2 Diabetes')")
    diagnosed_date: datetime = Field(..., description="Date condition was diagnosed")
    status: str = Field(default="active", description="Status: active or resolved")
    severity: str = Field(default="mild", description="Severity: mild, moderate, or severe")
    
    # Notes
    notes: Optional[str] = Field(None, description="Additional notes about the condition")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "conditions"  # Collection name in MongoDB
        indexes = [
            "patient",
            "doctor",
            "status",
            "diagnosed_date",
            "name",
        ]
        
    def __repr__(self) -> str:
        return f"<Condition {self.name} for {self.patient}>"

