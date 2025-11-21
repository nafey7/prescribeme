"""
Prescription Model
"""
from datetime import datetime
from typing import Optional, List
from beanie import Document, Link
from pydantic import Field
from .user import User
from .patient import Patient
from .doctor import Doctor


class Prescription(Document):
    """
    Prescription Document Model
    Represents a prescription with relationships to patient and doctor
    """
    
    # Relationships
    patient: Link[Patient] = Field(..., description="Patient who receives the prescription")
    doctor: Link[Doctor] = Field(..., description="Doctor who prescribed the medication")
    
    # Medication Details
    medication: str = Field(..., description="Medication name")
    generic_name: Optional[str] = Field(None, description="Generic name of medication")
    dosage: str = Field(..., description="Dosage (e.g., '10mg', '500mg')")
    frequency: str = Field(..., description="Frequency (e.g., 'Once daily', 'Twice daily')")
    duration: str = Field(..., description="Duration (e.g., '90 days', '7 days')")
    
    # Prescription Details
    prescribed_date: datetime = Field(default_factory=datetime.utcnow, description="Date prescription was created")
    expiry_date: Optional[datetime] = Field(None, description="Expiry date of prescription")
    status: str = Field(
        default="active",
        description="Status: active, completed, discontinued, expired, pending"
    )
    
    # Instructions and Notes
    instructions: Optional[str] = Field(None, description="Patient instructions")
    notes: Optional[str] = Field(None, description="Clinical notes (private)")
    
    # Refills
    refills: int = Field(default=0, ge=0, description="Number of refills allowed")
    refills_remaining: int = Field(default=0, ge=0, description="Number of refills remaining")
    
    # Pharmacy Information (can be a reference to Pharmacy model in future)
    pharmacy_name: Optional[str] = Field(None, description="Pharmacy name")
    pharmacy_address: Optional[str] = Field(None, description="Pharmacy address")
    pharmacy_phone: Optional[str] = Field(None, description="Pharmacy phone")
    
    # Additional Information
    warnings: List[str] = Field(default_factory=list, description="Important warnings")
    side_effects: List[str] = Field(default_factory=list, description="Possible side effects")
    interactions: List[str] = Field(default_factory=list, description="Drug interactions")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "prescriptions"  # Collection name in MongoDB
        indexes = [
            "patient",
            "doctor",
            "status",
            "prescribed_date",
            "medication",
        ]
        
    def __repr__(self) -> str:
        return f"<Prescription {self.medication} for {self.patient}>"

