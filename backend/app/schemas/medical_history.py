"""
Medical history response schemas
"""
from typing import Optional
from pydantic import BaseModel


class ConditionResponse(BaseModel):
    """Medical condition response"""
    id: str
    name: str
    diagnosedDate: str
    status: str  # active, resolved
    severity: str  # mild, moderate, severe
    doctor: str
    notes: Optional[str] = None


class AllergyResponse(BaseModel):
    """Allergy response"""
    id: str
    allergen: str
    reaction: str
    severity: str  # mild, moderate, severe
    diagnosedDate: str


class SurgeryResponse(BaseModel):
    """Surgery response"""
    id: str
    procedure: str
    date: str
    hospital: str
    surgeon: str
    notes: Optional[str] = None


class ImmunizationResponse(BaseModel):
    """Immunization response"""
    id: str
    vaccine: str
    date: str
    nextDue: Optional[str] = None
    provider: str


class LabResultResponse(BaseModel):
    """Lab result response"""
    id: str
    test: str
    date: str
    result: str
    status: str  # normal, abnormal, pending
    orderedBy: str


class MedicalHistoryResponse(BaseModel):
    """Complete medical history response"""
    conditions: list[ConditionResponse] = []
    allergies: list[AllergyResponse] = []
    surgeries: list[SurgeryResponse] = []
    immunizations: list[ImmunizationResponse] = []
    labResults: list[LabResultResponse] = []

