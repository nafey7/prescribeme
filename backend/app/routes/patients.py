"""
Patient-specific routes

All routes in this module require authentication and patient role.
Doctors cannot access these routes - they will receive a 403 Forbidden error.
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.dependencies.auth import get_current_patient
from app.models import (
    User,
    Patient,
    Prescription,
    Appointment,
    Doctor,
    Condition,
    Allergy,
    Surgery,
    Immunization,
    LabResult,
    Pharmacy,
)
from app.schemas import (
    PatientDashboardResponse,
    ActivePrescriptionResponse,
    AppointmentResponse,
    ActivityResponse,
    PrescriptionListItemResponse,
    PrescriptionDetailResponse,
    DoctorInfo,
    PharmacyInfo,
    DoctorListItemResponse,
    MedicalHistoryResponse,
    ConditionResponse,
    AllergyResponse,
    SurgeryResponse,
    ImmunizationResponse,
    LabResultResponse,
)

router = APIRouter(prefix="/patients", tags=["patients"])


async def get_patient_from_user(user: User) -> Patient:
    """Helper to get Patient document from User"""
    patient = await Patient.find_one(Patient.user.id == user.id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found"
        )
    return patient


@router.get("/me")
async def get_patient_profile(
    current_user: User = Depends(get_current_patient)
):
    """
    Get current patient's profile
    
    Requires: Patient role
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role,
    }


@router.get("/dashboard", response_model=PatientDashboardResponse)
async def get_patient_dashboard(
    current_user: User = Depends(get_current_patient)
):
    """
    Get patient dashboard data (active prescriptions, appointments, stats, activity)
    
    Requires: Patient role
    """
    patient = await get_patient_from_user(current_user)
    
    # Get active prescriptions
    active_prescriptions_docs = await Prescription.find(
        Prescription.patient.id == patient.id,
        Prescription.status == "active"
    ).sort(-Prescription.prescribed_date).limit(10).to_list()
    
    active_prescriptions = []
    for presc in active_prescriptions_docs:
        await presc.fetch_all_links()
        doctor_user = await presc.doctor.user.fetch()
        
        # Calculate days remaining
        if presc.expiry_date:
            days_remaining = (presc.expiry_date - datetime.utcnow()).days
        else:
            days_remaining = 0
        
        # Calculate next dose (simplified - assumes morning dose)
        next_dose = "8:00 AM"
        if presc.frequency == "Twice daily":
            next_dose = "8:00 AM, 8:00 PM"
        
        active_prescriptions.append(ActivePrescriptionResponse(
            id=str(presc.id),
            medication=presc.medication,
            dosage=presc.dosage,
            frequency=presc.frequency,
            doctor=doctor_user.full_name,
            daysRemaining=max(0, days_remaining),
            nextDose=next_dose,
        ))
    
    # Get upcoming appointments
    upcoming_appointments_docs = await Appointment.find(
        Appointment.patient.id == patient.id,
        Appointment.status.in_(["upcoming", "confirmed"]),
        Appointment.date >= datetime.utcnow()
    ).sort(Appointment.date).limit(10).to_list()
    
    upcoming_appointments = []
    for appt in upcoming_appointments_docs:
        await appt.fetch_all_links()
        doctor_user = await appt.doctor.user.fetch()
        doctor_doc = await Doctor.find_one(Doctor.user.id == doctor_user.id)
        
        upcoming_appointments.append(AppointmentResponse(
            id=str(appt.id),
            doctor=doctor_user.full_name,
            specialty=doctor_doc.specialty if doctor_doc else "General",
            date=appt.date.isoformat(),
            time=appt.date.strftime("%I:%M %p"),
            type=appt.type,
            status=appt.status,
        ))
    
    # Generate recent activity from prescriptions and appointments
    recent_activity = []
    
    # Add prescription activities
    recent_prescriptions = await Prescription.find(
        Prescription.patient.id == patient.id
    ).sort(-Prescription.created_at).limit(3).to_list()
    
    for presc in recent_prescriptions:
        await presc.fetch_all_links()
        doctor_user = await presc.doctor.user.fetch()
        
        days_ago = (datetime.utcnow() - presc.created_at).days
        timestamp = f"{days_ago} day{'s' if days_ago != 1 else ''} ago" if days_ago > 0 else "Today"
        
        recent_activity.append(ActivityResponse(
            id=f"presc_{presc.id}",
            type="prescription",
            title="New prescription added",
            description=f"{presc.medication} {presc.dosage} prescribed by {doctor_user.full_name}",
            timestamp=timestamp,
            icon="prescription",
        ))
    
    # Add appointment activities
    recent_appointments = await Appointment.find(
        Appointment.patient.id == patient.id
    ).sort(-Appointment.created_at).limit(2).to_list()
    
    for appt in recent_appointments:
        await appt.fetch_all_links()
        doctor_user = await appt.doctor.user.fetch()
        
        days_ago = (datetime.utcnow() - appt.created_at).days
        timestamp = f"{days_ago} day{'s' if days_ago != 1 else ''} ago" if days_ago > 0 else "Today"
        
        recent_activity.append(ActivityResponse(
            id=f"appt_{appt.id}",
            type="appointment",
            title="Appointment confirmed",
            description=f"Follow-up with {doctor_user.full_name} on {appt.date.strftime('%b %d')}",
            timestamp=timestamp,
            icon="calendar",
        ))
    
    # Sort activity by timestamp (most recent first)
    recent_activity.sort(key=lambda x: x.timestamp)
    
    # Calculate stats
    total_prescriptions = await Prescription.find(
        Prescription.patient.id == patient.id
    ).count()
    
    active_prescriptions_count = await Prescription.find(
        Prescription.patient.id == patient.id,
        Prescription.status == "active"
    ).count()
    
    total_appointments = await Appointment.find(
        Appointment.patient.id == patient.id
    ).count()
    
    total_lab_results = await LabResult.find(
        LabResult.patient.id == patient.id
    ).count()
    
    stats = {
        "activePrescriptions": active_prescriptions_count,
        "appointments": total_appointments,
        "doctors": 3,  # TODO: Calculate from unique doctors
        "labResults": total_lab_results,
    }
    
    return PatientDashboardResponse(
        activePrescriptions=active_prescriptions,
        upcomingAppointments=upcoming_appointments,
        recentActivity=recent_activity[:5],  # Limit to 5 most recent
        stats=stats,
    )


@router.get("/prescriptions", response_model=list[PrescriptionListItemResponse])
async def list_my_prescriptions(
    current_user: User = Depends(get_current_patient),
    status_filter: Optional[str] = Query(None, alias="status")
):
    """
    List patient's prescriptions (patient-only endpoint)
    
    Requires: Patient role
    """
    patient = await get_patient_from_user(current_user)
    
    query = Prescription.find(Prescription.patient.id == patient.id)
    
    if status_filter and status_filter != "all":
        query = query.find(Prescription.status == status_filter)
    
    prescriptions_docs = await query.sort(-Prescription.prescribed_date).to_list()
    
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


@router.get("/prescriptions/{prescription_id}", response_model=PrescriptionDetailResponse)
async def get_prescription_details(
    prescription_id: str,
    current_user: User = Depends(get_current_patient)
):
    """
    Get prescription details (patient-only endpoint)
    
    Requires: Patient role
    """
    patient = await get_patient_from_user(current_user)
    
    try:
        from bson import ObjectId
        presc = await Prescription.get(ObjectId(prescription_id))
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found"
        )
    
    # Verify prescription belongs to patient
    if presc.patient.id != patient.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    await presc.fetch_all_links()
    doctor_user = await presc.doctor.user.fetch()
    doctor_doc = await Doctor.find_one(Doctor.user.id == doctor_user.id)
    
    # Get pharmacy info if available
    pharmacy_info = None
    if presc.pharmacy_name:
        pharmacy_info = PharmacyInfo(
            name=presc.pharmacy_name,
            address=presc.pharmacy_address,
            phone=presc.pharmacy_phone,
            hours=None,
        )
    else:
        pharmacy_info = PharmacyInfo(
            name="Not specified",
            address=None,
            phone=None,
            hours=None,
        )
    
    return PrescriptionDetailResponse(
        id=str(presc.id),
        medication=presc.medication,
        genericName=presc.generic_name,
        dosage=presc.dosage,
        frequency=presc.frequency,
        duration=presc.duration,
        prescribedDate=presc.prescribed_date.isoformat(),
        expiryDate=presc.expiry_date.isoformat() if presc.expiry_date else "",
        status=presc.status,
        refillsRemaining=presc.refills_remaining,
        totalRefills=presc.refills + presc.refills_remaining,
        instructions=presc.instructions,
        warnings=presc.warnings,
        sideEffects=presc.side_effects,
        interactions=presc.interactions,
        doctor=DoctorInfo(
            name=doctor_user.full_name,
            specialty=doctor_doc.specialty if doctor_doc else "General",
            phone=None,  # TODO: Add phone to doctor model
            email=doctor_user.email,
        ),
        pharmacy=pharmacy_info,
    )


@router.get("/doctors", response_model=list[DoctorListItemResponse])
async def list_doctors(
    current_user: User = Depends(get_current_patient),
    search: Optional[str] = Query(None),
    specialty: Optional[str] = Query(None)
):
    """
    List available doctors (patient-only endpoint)
    
    Requires: Patient role
    """
    query = Doctor.find(Doctor.accepting_new_patients == True)
    
    if specialty and specialty != "all":
        query = query.find(Doctor.specialty == specialty)
    
    doctors_docs = await query.to_list()
    
    doctors = []
    for doctor_doc in doctors_docs:
        await doctor_doc.fetch_all_links()
        doctor_user = await doctor_doc.user.fetch()
        
        # Apply search filter if provided (client-side filtering for better UX)
        if search:
            search_lower = search.lower()
            if (search_lower not in doctor_user.full_name.lower() and
                search_lower not in doctor_doc.specialty.lower() and
                search_lower not in doctor_doc.hospital.lower()):
                continue
        
        doctors.append(DoctorListItemResponse(
            id=str(doctor_doc.id),
            name=doctor_user.full_name,
            specialty=doctor_doc.specialty,
            rating=doctor_doc.rating,
            reviewCount=doctor_doc.review_count,
            experience=doctor_doc.experience_years,
            hospital=doctor_doc.hospital,
            availability=doctor_doc.availability,
            acceptingNewPatients=doctor_doc.accepting_new_patients,
            languages=doctor_doc.languages,
            distance=doctor_doc.distance,
        ))
    
    return doctors


@router.get("/medical-history", response_model=MedicalHistoryResponse)
async def get_medical_history(
    current_user: User = Depends(get_current_patient)
):
    """
    Get patient's medical history (patient-only endpoint)
    
    Requires: Patient role
    """
    patient = await get_patient_from_user(current_user)
    
    # Get conditions
    conditions_docs = await Condition.find(
        Condition.patient.id == patient.id
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
    
    # Get allergies
    allergies_docs = await Allergy.find(
        Allergy.patient.id == patient.id
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
    
    # Get surgeries
    surgeries_docs = await Surgery.find(
        Surgery.patient.id == patient.id
    ).sort(-Surgery.date).to_list()
    
    surgeries = []
    for surgery in surgeries_docs:
        surgeries.append(SurgeryResponse(
            id=str(surgery.id),
            procedure=surgery.procedure,
            date=surgery.date.isoformat(),
            hospital=surgery.hospital,
            surgeon=surgery.surgeon,
            notes=surgery.notes,
        ))
    
    # Get immunizations
    immunizations_docs = await Immunization.find(
        Immunization.patient.id == patient.id
    ).sort(-Immunization.date).to_list()
    
    immunizations = []
    for imm in immunizations_docs:
        immunizations.append(ImmunizationResponse(
            id=str(imm.id),
            vaccine=imm.vaccine,
            date=imm.date.isoformat(),
            nextDue=imm.next_due.isoformat() if imm.next_due else None,
            provider=imm.provider,
        ))
    
    # Get lab results
    lab_results_docs = await LabResult.find(
        LabResult.patient.id == patient.id
    ).sort(-LabResult.date).to_list()
    
    lab_results = []
    for lab in lab_results_docs:
        await lab.fetch_all_links()
        doctor_user = await lab.ordered_by.user.fetch()
        
        lab_results.append(LabResultResponse(
            id=str(lab.id),
            test=lab.test,
            date=lab.date.isoformat(),
            result=lab.result,
            status=lab.status,
            orderedBy=doctor_user.full_name,
        ))
    
    return MedicalHistoryResponse(
        conditions=conditions,
        allergies=allergies,
        surgeries=surgeries,
        immunizations=immunizations,
        labResults=lab_results,
    )

