"""
User Model
Example Beanie Document Model
"""
from datetime import datetime
from typing import Optional
from beanie import Document, Indexed
from pydantic import EmailStr, Field


class User(Document):
    """
    User Document Model
    
    This is an example Beanie document model demonstrating:
    - Document inheritance from Beanie
    - Field definitions with Pydantic
    - Indexed fields for better query performance
    - Timestamps (created_at, updated_at)
    """
    
    # Indexed fields (faster lookups)
    email: Indexed(EmailStr, unique=True)
    username: Indexed(str, unique=True)
    
    # Regular fields
    full_name: str
    password_hash: str
    is_active: bool = True
    is_verified: bool = False
    
    # Role-based access
    role: str = Field(default="patient", description="User role: patient, doctor, or admin")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        """Beanie Document Settings"""
        name = "users"  # Collection name in MongoDB
        indexes = [
            "email",
            "username",
            "role",
            "created_at",
        ]
        
    def __repr__(self) -> str:
        return f"<User {self.email}>"


# Note: You can add more document models here:
# - Prescription
# - Patient
# - Doctor
# - MedicalRecord
# etc.

