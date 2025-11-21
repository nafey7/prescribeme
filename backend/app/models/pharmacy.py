"""
Pharmacy Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class Pharmacy(Document):
    """
    Pharmacy Document Model
    Represents a pharmacy where prescriptions can be filled
    """
    
    # Pharmacy Details
    name: str = Field(..., description="Pharmacy name (e.g., 'CVS Pharmacy')")
    address: str = Field(..., description="Pharmacy address")
    phone: Optional[str] = Field(None, description="Pharmacy phone number")
    hours: Optional[str] = Field(None, description="Business hours (e.g., 'Mon-Fri: 8AM-9PM')")
    
    # Location (optional, for distance calculations)
    latitude: Optional[float] = Field(None, description="Latitude for location")
    longitude: Optional[float] = Field(None, description="Longitude for location")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "pharmacies"  # Collection name in MongoDB
        indexes = [
            "name",
            "address",
        ]
        
    def __repr__(self) -> str:
        return f"<Pharmacy {self.name}>"

