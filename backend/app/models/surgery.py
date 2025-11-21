"""
Surgery Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .patient import Patient


class Surgery(Document):
    """
    Surgery Document Model
    Represents a surgical procedure performed on a patient
    """
    
    # Relationships
    patient: Link[Patient] = Field(..., description="Patient who had the surgery")
    
    # Surgery Details
    procedure: str = Field(..., description="Surgical procedure name (e.g., 'Appendectomy')")
    date: datetime = Field(..., description="Date surgery was performed")
    hospital: str = Field(..., description="Hospital where surgery was performed")
    surgeon: str = Field(..., description="Surgeon name")
    
    # Notes
    notes: Optional[str] = Field(None, description="Additional notes about the surgery")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "surgeries"  # Collection name in MongoDB
        indexes = [
            "patient",
            "date",
            "procedure",
        ]
        
    def __repr__(self) -> str:
        return f"<Surgery {self.procedure} for {self.patient}>"

