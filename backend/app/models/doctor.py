"""
Doctor Model
"""
from datetime import datetime
from typing import Optional, List
from beanie import Document, Link
from pydantic import Field
from .user import User


class Doctor(Document):
    """
    Doctor Document Model
    Represents a doctor profile linked to a User account
    """
    
    # Link to User account
    user: Link[User]
    
    # Professional Information
    specialty: str = Field(..., description="Medical specialty (e.g., Internal Medicine, Cardiology)")
    hospital: str = Field(..., description="Hospital or clinic name")
    experience_years: int = Field(..., description="Years of experience")
    license_number: Optional[str] = Field(None, description="Medical license number")
    
    # Availability
    accepting_new_patients: bool = Field(default=True, description="Whether accepting new patients")
    availability: Optional[str] = Field(None, description="Availability status (e.g., 'Available Today')")
    
    # Languages spoken
    languages: List[str] = Field(default_factory=list, description="Languages spoken by the doctor")
    
    # Ratings (can be calculated from reviews)
    rating: float = Field(default=0.0, ge=0.0, le=5.0, description="Average rating")
    review_count: int = Field(default=0, description="Total number of reviews")
    
    # Location (optional, for distance calculations)
    distance: Optional[str] = Field(None, description="Distance from patient (e.g., '0.5 miles')")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "doctors"  # Collection name in MongoDB
        indexes = [
            "user",
            "specialty",
            "hospital",
            "accepting_new_patients",
            "rating",
        ]
        
    def __repr__(self) -> str:
        return f"<Doctor {self.specialty}>"

