"""
Lab Result Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .patient import Patient
from .doctor import Doctor


class LabResult(Document):
    """
    Lab Result Document Model
    Represents a laboratory test result for a patient
    """
    
    # Relationships
    patient: Link[Patient] = Field(..., description="Patient who had the lab test")
    ordered_by: Link[Doctor] = Field(..., description="Doctor who ordered the test")
    
    # Lab Test Details
    test: str = Field(..., description="Test name (e.g., 'Complete Blood Count (CBC)')")
    date: datetime = Field(..., description="Date test was performed")
    result: str = Field(..., description="Test result description")
    status: str = Field(default="pending", description="Status: normal, abnormal, or pending")
    
    # Additional Information
    report_url: Optional[str] = Field(None, description="URL to full lab report if available")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "lab_results"  # Collection name in MongoDB
        indexes = [
            "patient",
            "ordered_by",
            "date",
            "status",
            "test",
        ]
        
    def __repr__(self) -> str:
        return f"<LabResult {self.test} for {self.patient}>"

