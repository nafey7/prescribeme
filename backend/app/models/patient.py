"""
Patient Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from .user import User


class Patient(Document):
    """
    Patient Document Model
    Represents a patient profile linked to a User account
    """
    
    # Link to User account
    user: Link[User]
    
    # Personal Information
    age: Optional[int] = Field(None, ge=0, description="Patient age")
    gender: Optional[str] = Field(None, description="Patient gender")
    phone: Optional[str] = Field(None, description="Phone number")
    address: Optional[str] = Field(None, description="Address")
    
    # Medical Information
    blood_type: Optional[str] = Field(None, description="Blood type (e.g., 'A+', 'O-')")
    height: Optional[str] = Field(None, description="Height (e.g., '5\'6\"')")
    weight: Optional[str] = Field(None, description="Weight (e.g., '145 lbs')")
    
    # Status
    status: str = Field(default="active", description="Patient status: active or inactive")
    last_visit: Optional[datetime] = Field(None, description="Date of last visit")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "patients"  # Collection name in MongoDB
        indexes = [
            "user",
            "status",
            "last_visit",
        ]
        
    def __repr__(self) -> str:
        return f"<Patient {self.user}>"

