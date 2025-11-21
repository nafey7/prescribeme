"""
Doctor-specific routes

All routes in this module require authentication and doctor role.
Patients cannot access these routes - they will receive a 403 Forbidden error.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.dependencies.auth import get_current_doctor
from app.models import (
    User,
    Doctor,
    Patient,
    Prescription,
    Condition,
    Allergy,
)
from app.schemas import (
    PatientListItemResponse,
    PatientProfileResponse,
    PrescriptionHistoryItemResponse,
    PrescriptionListItemResponse,
    ConditionResponse,
    AllergyResponse,
)

router = APIRouter(prefix="/doctors", tags=["doctors"])


async def get_doctor_from_user(user: User) -> Doctor:
    """Helper to get Doctor document from User"""
    doctor = await Doctor.find_one(Doctor.user.id == user.id)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found"
        )
    return doctor


@router.get("/me")
async def get_doctor_profile(
    current_user: User = Depends(get_current_doctor)
):
    """
    Get current doctor's profile
    
    Requires: Doctor role
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role,
    }


@router.get("/patients", response_model=list[PatientListItemResponse])
async def list_patients(
    current_user: User = Depends(get_current_doctor),
    search: Optional[str] = Query(None)
):
    """
    List all patients (doctor-only endpoint)
    
    Requires: Doctor role
    Patients attempting to access this will receive 403 Forbidden.
    """
    query = Patient.find()
    
    patients_docs = await query.to_list()
    
    patients = []
    for patient_doc in patients_docs:
        await patient_doc.fetch_all_links()
        patient_user = await patient_doc.user.fetch()
        
        # Apply search filter if provided
        if search:
            search_lower = search.lower()
            if (search_lower not in patient_user.full_name.lower() and
                search_lower not in patient_user.email.lower() and
                (patient_doc.phone and search_lower not in patient_doc.phone.lower())):
                continue
        
        # Get active conditions for this patient
        conditions_docs = await Condition.find(
            Condition.patient.id == patient_doc.id,
            Condition.status == "active"
        ).to_list()
        conditions = [cond.name for cond in conditions_docs]
        
        patients.append(PatientListItemResponse(
            id=str(patient_doc.id),
            name=patient_user.full_name,
            age=patient_doc.age,
            gender=patient_doc.gender,
            email=patient_user.email,
            phone=patient_doc.phone,
            lastVisit=patient_doc.last_visit.isoformat() if patient_doc.last_visit else None,
            status=patient_doc.status,
            conditions=conditions,
        ))
    
    return patients


@router.get("/patients/{patient_id}", response_model=PatientProfileResponse)
async def get_patient_details(
    patient_id: str,
    current_user: User = Depends(get_current_doctor)
):
    """
    Get patient details (doctor-only endpoint)
    
    Requires: Doctor role
    """
    try:
        from bson import ObjectId
        patient_doc = await Patient.get(ObjectId(patient_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    await patient_doc.fetch_all_links()
    patient_user = await patient_doc.user.fetch()
    
    return PatientProfileResponse(
        id=str(patient_doc.id),
        name=patient_user.full_name,
        age=patient_doc.age,
        gender=patient_doc.gender,
        email=patient_user.email,
        phone=patient_doc.phone,
        address=patient_doc.address,
        bloodType=patient_doc.blood_type,
        height=patient_doc.height,
        weight=patient_doc.weight,
        lastVisit=patient_doc.last_visit.isoformat() if patient_doc.last_visit else None,
        status=patient_doc.status,
    )


@router.get("/patients/{patient_id}/prescriptions", response_model=list[PrescriptionListItemResponse])
async def get_patient_prescriptions(
    patient_id: str,
    current_user: User = Depends(get_current_doctor)
):
    """
    Get patient's prescriptions (doctor-only endpoint)
    
    Requires: Doctor role
    """
    try:
        from bson import ObjectId
        patient_doc = await Patient.get(ObjectId(patient_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    prescriptions_docs = await Prescription.find(
        Prescription.patient.id == patient_doc.id
    ).sort(-Prescription.prescribed_date).to_list()
    
    prescriptions = []
    for presc in prescriptions_docs:
        await presc.fetch_all_links()
        doctor_user = await presc.doctor.user.fetch()
        
        prescriptions.append(PrescriptionListItemResponse(
            id=str(presc.id),
            medication=presc.medication,
            dosage=presc.dosage,
            frequency=presc.frequency,
            doctor=doctor_user.full_name,
            prescribedDate=presc.prescribed_date.isoformat(),
            expiryDate=presc.expiry_date.isoformat() if presc.expiry_date else "",
            status=presc.status,
            refillsRemaining=presc.refills_remaining,
            pharmacy=presc.pharmacy_name or "Not specified",
        ))
    
    return prescriptions


@router.get("/patients/{patient_id}/conditions", response_model=list[ConditionResponse])
async def get_patient_conditions(
    patient_id: str,
    current_user: User = Depends(get_current_doctor)
):
    """
    Get patient's medical conditions (doctor-only endpoint)
    
    Requires: Doctor role
    """
    try:
        from bson import ObjectId
        patient_doc = await Patient.get(ObjectId(patient_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    conditions_docs = await Condition.find(
        Condition.patient.id == patient_doc.id
    ).sort(-Condition.diagnosed_date).to_list()
    
    conditions = []
    for cond in conditions_docs:
        await cond.fetch_all_links()
        doctor_user = await cond.doctor.user.fetch()
        
        conditions.append(ConditionResponse(
            id=str(cond.id),
            name=cond.name,
            diagnosedDate=cond.diagnosed_date.isoformat(),
            status=cond.status,
            severity=cond.severity,
            doctor=doctor_user.full_name,
            notes=cond.notes,
        ))
    
    return conditions


@router.get("/patients/{patient_id}/allergies", response_model=list[AllergyResponse])
async def get_patient_allergies(
    patient_id: str,
    current_user: User = Depends(get_current_doctor)
):
    """
    Get patient's allergies (doctor-only endpoint)
    
    Requires: Doctor role
    """
    try:
        from bson import ObjectId
        patient_doc = await Patient.get(ObjectId(patient_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    allergies_docs = await Allergy.find(
        Allergy.patient.id == patient_doc.id
    ).sort(-Allergy.diagnosed_date).to_list()
    
    allergies = []
    for allergy in allergies_docs:
        allergies.append(AllergyResponse(
            id=str(allergy.id),
            allergen=allergy.allergen,
            reaction=allergy.reaction,
            severity=allergy.severity,
            diagnosedDate=allergy.diagnosed_date.isoformat(),
        ))
    
    return allergies


@router.post("/prescriptions")
async def create_prescription(
    current_user: User = Depends(get_current_doctor)
):
    """
    Create a new prescription (doctor-only endpoint)
    
    Requires: Doctor role
    """
    # TODO: Implement prescription creation logic
    return {
        "message": "Prescription created",
        "doctor_id": str(current_user.id)
    }


@router.get("/prescriptions", response_model=list[PrescriptionHistoryItemResponse])
async def list_prescriptions(
    current_user: User = Depends(get_current_doctor),
    search: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status")
):
    """
    List doctor's prescriptions (doctor-only endpoint)
    
    Requires: Doctor role
    """
    doctor = await get_doctor_from_user(current_user)
    
    query = Prescription.find(Prescription.doctor.id == doctor.id)
    
    if status_filter and status_filter != "all":
        query = query.find(Prescription.status == status_filter)
    
    prescriptions_docs = await query.sort(-Prescription.prescribed_date).to_list()
    
    prescriptions = []
    for presc in prescriptions_docs:
        await presc.fetch_all_links()
        patient_user = await presc.patient.user.fetch()
        
        # Apply search filter if provided
        if search:
            search_lower = search.lower()
            if (search_lower not in patient_user.full_name.lower() and
                search_lower not in presc.medication.lower()):
                continue
        
        prescriptions.append(PrescriptionHistoryItemResponse(
            id=str(presc.id),
            patientName=patient_user.full_name,
            patientId=str(presc.patient.id),
            medication=presc.medication,
            dosage=presc.dosage,
            frequency=presc.frequency,
            duration=presc.duration,
            prescribedDate=presc.prescribed_date.isoformat(),
            status=presc.status,
            prescribedBy=current_user.full_name,
        ))
    
    return prescriptions

