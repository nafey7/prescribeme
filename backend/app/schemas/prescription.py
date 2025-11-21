"""
Prescription response schemas
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class DoctorInfo(BaseModel):
    """Doctor information for prescription responses"""
    name: str
    specialty: str
    phone: Optional[str] = None
    email: Optional[str] = None


class PharmacyInfo(BaseModel):
    """Pharmacy information for prescription responses"""
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    hours: Optional[str] = None


class ActivePrescriptionResponse(BaseModel):
    """Active prescription response for dashboard"""
    id: str
    medication: str
    dosage: str
    frequency: str
    doctor: str
    daysRemaining: int
    nextDose: str


class PrescriptionListItemResponse(BaseModel):
    """Prescription list item response"""
    id: str
    medication: str
    dosage: str
    frequency: str
    doctor: str
    prescribedDate: str
    expiryDate: str
    status: str  # active, completed, expired
    refillsRemaining: int
    pharmacy: str


class PrescriptionDetailResponse(BaseModel):
    """Detailed prescription response"""
    id: str
    medication: str
    genericName: Optional[str] = None
    dosage: str
    frequency: str
    duration: str
    prescribedDate: str
    expiryDate: str
    status: str
    refillsRemaining: int
    totalRefills: int
    instructions: Optional[str] = None
    warnings: List[str] = Field(default_factory=list)
    sideEffects: List[str] = Field(default_factory=list)
    interactions: List[str] = Field(default_factory=list)
    doctor: DoctorInfo
    pharmacy: PharmacyInfo


class PrescriptionHistoryItemResponse(BaseModel):
    """Prescription history item for doctor view"""
    id: str
    patientName: str
    patientId: str
    medication: str
    dosage: str
    frequency: str
    duration: str
    prescribedDate: str
    status: str
    prescribedBy: str

