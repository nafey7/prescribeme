"""
Allergy Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .patient import Patient


class Allergy(Document):
    """
    Allergy Document Model
    Represents an allergy for a patient
    """
    
    # Relationships
    patient: Link[Patient] = Field(..., description="Patient with this allergy")
    
    # Allergy Details
    allergen: str = Field(..., description="Allergen name (e.g., 'Penicillin', 'Shellfish')")
    reaction: str = Field(..., description="Reaction description (e.g., 'Rash, itching', 'Anaphylaxis')")
    severity: str = Field(default="mild", description="Severity: mild, moderate, or severe")
    diagnosed_date: datetime = Field(..., description="Date allergy was diagnosed")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "allergies"  # Collection name in MongoDB
        indexes = [
            "patient",
            "allergen",
            "severity",
            "diagnosed_date",
        ]
        
    def __repr__(self) -> str:
        return f"<Allergy {self.allergen} for {self.patient}>"

