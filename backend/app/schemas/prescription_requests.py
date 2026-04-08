"""
Request bodies for prescription mutations.
"""
from typing import Optional
from pydantic import BaseModel, Field


class CreatePrescriptionRequest(BaseModel):
    patient_id: str = Field(..., description="Patient document id")
    medication: str = Field(..., min_length=1, max_length=200)
    dosage: str = Field(..., min_length=1, max_length=100)
    frequency: str = Field(..., min_length=1, max_length=200)
    duration: str = Field(..., min_length=1, max_length=200)
    instructions: Optional[str] = Field(None, max_length=2000)
    notes: Optional[str] = Field(None, max_length=2000)
    refills: Optional[int] = Field(0, ge=0, le=99)


class UpdatePrescriptionRequest(BaseModel):
    medication: Optional[str] = Field(None, min_length=1, max_length=200)
    dosage: Optional[str] = Field(None, min_length=1, max_length=100)
    frequency: Optional[str] = Field(None, min_length=1, max_length=200)
    duration: Optional[str] = Field(None, min_length=1, max_length=200)
    instructions: Optional[str] = Field(None, max_length=2000)
    notes: Optional[str] = Field(None, max_length=2000)
    refills: Optional[int] = Field(None, ge=0, le=99)
    refills_remaining: Optional[int] = Field(None, ge=0, le=99)
    status: Optional[str] = Field(
        None,
        pattern="^(active|completed|discontinued|expired|pending)$",
    )
