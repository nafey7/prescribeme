"""
Doctor-specific routes

All routes in this module require authentication and doctor role.
Patients cannot access these routes - they will receive a 403 Forbidden error.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.dependencies.auth import get_current_doctor
from datetime import datetime
from bson import ObjectId
from beanie.operators import In
from app.models import (
    User,
    Doctor,
    Patient,
    Prescription,
    Condition,
    Allergy,
    CareRelationship,
)
from app.schemas.prescription_requests import (
    CreatePrescriptionRequest,
    UpdatePrescriptionRequest,
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


async def _patient_list_items_for_docs(
    patients_docs: list,
    search: Optional[str],
) -> list[PatientListItemResponse]:
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

        allergies_docs = await Allergy.find(Allergy.patient.id == patient_doc.id).to_list()
        allergies = [a.allergen for a in allergies_docs]

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
            allergies=allergies,
        ))
    return patients


@router.get("/patients", response_model=list[PatientListItemResponse])
async def list_patients(
    current_user: User = Depends(get_current_doctor),
    search: Optional[str] = Query(None),
    scope: str = Query(
        "mine",
        description="'mine' = patients with a care relationship; 'all' = full directory (e.g. prescription picker)",
    ),
):
    """
    List patients. Default scope is patients linked to this doctor via care relationships.
    Use scope=all for the full patient directory when creating a new prescription.
    """
    doctor = await get_doctor_from_user(current_user)

    if scope == "all":
        patients_docs = await Patient.find().to_list()
    else:
        rels = await CareRelationship.find(
            CareRelationship.doctor.id == doctor.id
        ).to_list()
        patient_ids = []
        for rel in rels:
            await rel.fetch_link(CareRelationship.patient)
            if rel.patient:
                patient_ids.append(rel.patient.id)
        if not patient_ids:
            return []
        patients_docs = await Patient.find(In(Patient.id, patient_ids)).to_list()

    return await _patient_list_items_for_docs(patients_docs, search)


async def _require_patient_access(doctor: Doctor, patient_doc: Patient) -> None:
    rel = await CareRelationship.find_one(
        CareRelationship.doctor.id == doctor.id,
        CareRelationship.patient.id == patient_doc.id,
    )
    if not rel:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this patient",
        )


@router.get("/patients/{patient_id}", response_model=PatientProfileResponse)
async def get_patient_details(
    patient_id: str,
    current_user: User = Depends(get_current_doctor)
):
    """
    Get patient details (doctor-only endpoint)
    
    Requires: Doctor role
    """
    doctor = await get_doctor_from_user(current_user)
    try:
        patient_doc = await Patient.get(ObjectId(patient_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    if not patient_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    await _require_patient_access(doctor, patient_doc)

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
    doctor = await get_doctor_from_user(current_user)
    try:
        patient_doc = await Patient.get(ObjectId(patient_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    if not patient_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    await _require_patient_access(doctor, patient_doc)

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
    doctor = await get_doctor_from_user(current_user)
    try:
        patient_doc = await Patient.get(ObjectId(patient_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    if not patient_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    await _require_patient_access(doctor, patient_doc)

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
    doctor = await get_doctor_from_user(current_user)
    try:
        patient_doc = await Patient.get(ObjectId(patient_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    if not patient_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    await _require_patient_access(doctor, patient_doc)

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


@router.post("/prescriptions", status_code=status.HTTP_201_CREATED)
async def create_prescription(
    body: CreatePrescriptionRequest,
    current_user: User = Depends(get_current_doctor),
):
    """Create a prescription and ensure a care relationship exists."""
    doctor = await get_doctor_from_user(current_user)
    try:
        patient_doc = await Patient.get(ObjectId(body.patient_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    if not patient_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    existing_rel = await CareRelationship.find_one(
        CareRelationship.doctor.id == doctor.id,
        CareRelationship.patient.id == patient_doc.id,
    )
    if not existing_rel:
        await CareRelationship(doctor=doctor, patient=patient_doc).insert()

    refills = body.refills or 0
    presc = Prescription(
        patient=patient_doc,
        doctor=doctor,
        medication=body.medication,
        dosage=body.dosage,
        frequency=body.frequency,
        duration=body.duration,
        instructions=body.instructions,
        notes=body.notes,
        refills=refills,
        refills_remaining=refills,
        status="active",
        prescribed_date=datetime.utcnow(),
    )
    await presc.insert()
    return {"id": str(presc.id), "message": "Prescription created"}


@router.get("/prescriptions/{prescription_id}", response_model=PrescriptionHistoryItemResponse)
async def get_doctor_prescription(
    prescription_id: str,
    current_user: User = Depends(get_current_doctor),
):
    doctor = await get_doctor_from_user(current_user)
    try:
        presc = await Prescription.get(ObjectId(prescription_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found",
        )
    await presc.fetch_all_links()
    if not presc or presc.doctor.id != doctor.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found",
        )
    patient_user = await presc.patient.user.fetch()
    return PrescriptionHistoryItemResponse(
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
        instructions=presc.instructions,
        notes=presc.notes,
        refills=presc.refills,
        refillsRemaining=presc.refills_remaining,
    )


@router.patch("/prescriptions/{prescription_id}")
async def update_doctor_prescription(
    prescription_id: str,
    body: UpdatePrescriptionRequest,
    current_user: User = Depends(get_current_doctor),
):
    doctor = await get_doctor_from_user(current_user)
    try:
        presc = await Prescription.get(ObjectId(prescription_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found",
        )
    await presc.fetch_all_links()
    if not presc or presc.doctor.id != doctor.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found",
        )

    update_data = body.model_dump(exclude_unset=True)
    if "status" in update_data and update_data["status"]:
        presc.status = update_data["status"]
    if "medication" in update_data:
        presc.medication = update_data["medication"]
    if "dosage" in update_data:
        presc.dosage = update_data["dosage"]
    if "frequency" in update_data:
        presc.frequency = update_data["frequency"]
    if "duration" in update_data:
        presc.duration = update_data["duration"]
    if "instructions" in update_data:
        presc.instructions = update_data["instructions"]
    if "notes" in update_data:
        presc.notes = update_data["notes"]
    if "refills" in update_data and update_data["refills"] is not None:
        presc.refills = update_data["refills"]
    if "refills_remaining" in update_data and update_data["refills_remaining"] is not None:
        presc.refills_remaining = update_data["refills_remaining"]
    presc.updated_at = datetime.utcnow()
    await presc.save()
    return {"message": "Prescription updated", "id": str(presc.id)}


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
            instructions=presc.instructions,
            notes=presc.notes,
            refills=presc.refills,
            refillsRemaining=presc.refills_remaining,
        ))
    
    return prescriptions

