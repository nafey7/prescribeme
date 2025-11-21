"""
Immunization Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .patient import Patient


class Immunization(Document):
    """
    Immunization Document Model
    Represents a vaccination/immunization record for a patient
    """
    
    # Relationships
    patient: Link[Patient] = Field(..., description="Patient who received the immunization")
    
    # Immunization Details
    vaccine: str = Field(..., description="Vaccine name (e.g., 'COVID-19 (Pfizer)', 'Influenza')")
    date: datetime = Field(..., description="Date immunization was given")
    next_due: Optional[datetime] = Field(None, description="Next due date for booster/update")
    provider: str = Field(..., description="Provider who administered the vaccine")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "immunizations"  # Collection name in MongoDB
        indexes = [
            "patient",
            "date",
            "vaccine",
            "next_due",
        ]
        
    def __repr__(self) -> str:
        return f"<Immunization {self.vaccine} for {self.patient}>"

