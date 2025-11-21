"""
Database Seeder
Seeds test data into the database on server start/restart
"""
from datetime import datetime, timedelta
from typing import List
from app.models import (
    User,
    Doctor,
    Patient,
    Prescription,
    Condition,
    Allergy,
    Surgery,
    Immunization,
    LabResult,
    Appointment,
    Notification,
    Pharmacy,
)
from app.utils.auth import hash_password
from app.config.settings import settings


async def check_if_seeded() -> bool:
    """
    Check if test data has already been seeded
    Returns True if test users exist, False otherwise
    """
    # Check if any user with email starting with "test" exists
    # Check for a specific test email we know will be created
    test_user = await User.find_one(User.email == "test-doctor-1@gmail.com")
    if test_user:
        return True
    
    # Also check for a test patient email
    test_patient = await User.find_one(User.email == "test-patient-1@gmail.com")
    return test_patient is not None


async def seed_database():
    """
    Seed the database with test data
    Only seeds if test data doesn't already exist
    """
    # Check if already seeded
    if await check_if_seeded():
        print("✅ Test data already exists. Skipping seed.")
        return

    print("🌱 Starting database seeding...")

    # Password hash for all test users
    # SECURITY: Password is loaded from SEEDER_PASSWORD environment variable
    password_hash = hash_password(settings.seeder_password)

    # Create Pharmacies first (no dependencies)
    pharmacies = await create_pharmacies()
    print(f"✅ Created {len(pharmacies)} pharmacies")

    # Create Users
    users = await create_users(password_hash)
    print(f"✅ Created {len(users)} users")

    # Create Doctors
    doctors = await create_doctors(users)
    print(f"✅ Created {len(doctors)} doctors")

    # Create Patients
    patients = await create_patients(users)
    print(f"✅ Created {len(patients)} patients")

    # Create Prescriptions
    prescriptions = await create_prescriptions(patients, doctors, pharmacies)
    print(f"✅ Created {len(prescriptions)} prescriptions")

    # Create Conditions
    conditions = await create_conditions(patients, doctors)
    print(f"✅ Created {len(conditions)} conditions")

    # Create Allergies
    allergies = await create_allergies(patients)
    print(f"✅ Created {len(allergies)} allergies")

    # Create Surgeries
    surgeries = await create_surgeries(patients)
    print(f"✅ Created {len(surgeries)} surgeries")

    # Create Immunizations
    immunizations = await create_immunizations(patients)
    print(f"✅ Created {len(immunizations)} immunizations")

    # Create Lab Results
    lab_results = await create_lab_results(patients, doctors)
    print(f"✅ Created {len(lab_results)} lab results")

    # Create Appointments
    appointments = await create_appointments(patients, doctors)
    print(f"✅ Created {len(appointments)} appointments")

    # Create Notifications
    notifications = await create_notifications(users)
    print(f"✅ Created {len(notifications)} notifications")

    print("✅ Database seeding completed successfully!")


async def create_pharmacies() -> List[Pharmacy]:
    """Create pharmacy records"""
    pharmacies_data = [
        {
            "name": "CVS Pharmacy - Main Street",
            "address": "123 Main St, San Francisco, CA 94102",
            "phone": "+1 (555) 111-2222",
            "hours": "Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-6PM",
        },
        {
            "name": "Walgreens - Downtown",
            "address": "456 Market St, San Francisco, CA 94103",
            "phone": "+1 (555) 222-3333",
            "hours": "Mon-Fri: 7AM-10PM, Sat-Sun: 8AM-8PM",
        },
        {
            "name": "Rite Aid - Park Avenue",
            "address": "789 Park Ave, San Francisco, CA 94104",
            "phone": "+1 (555) 333-4444",
            "hours": "Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-7PM",
        },
    ]

    pharmacies = []
    for data in pharmacies_data:
        pharmacy = Pharmacy(**data)
        await pharmacy.insert()
        pharmacies.append(pharmacy)

    return pharmacies


async def create_users(password_hash: str) -> List[User]:
    """Create user accounts"""
    users_data = [
        # Doctors
        {
            "email": "test-doctor-1@gmail.com",
            "username": "test-doctor-1",
            "full_name": "Dr. Sarah Smith",
            "password_hash": password_hash,
            "role": "doctor",
            "is_active": True,
            "is_verified": True,
        },
        {
            "email": "test-doctor-2@gmail.com",
            "username": "test-doctor-2",
            "full_name": "Dr. Michael Chen",
            "password_hash": password_hash,
            "role": "doctor",
            "is_active": True,
            "is_verified": True,
        },
        {
            "email": "test-doctor-3@gmail.com",
            "username": "test-doctor-3",
            "full_name": "Dr. Emily Rodriguez",
            "password_hash": password_hash,
            "role": "doctor",
            "is_active": True,
            "is_verified": True,
        },
        {
            "email": "test-doctor-4@gmail.com",
            "username": "test-doctor-4",
            "full_name": "Dr. James Wilson",
            "password_hash": password_hash,
            "role": "doctor",
            "is_active": True,
            "is_verified": True,
        },
        {
            "email": "test-doctor-5@gmail.com",
            "username": "test-doctor-5",
            "full_name": "Dr. Lisa Patel",
            "password_hash": password_hash,
            "role": "doctor",
            "is_active": True,
            "is_verified": True,
        },
        # Patients
        {
            "email": "test-patient-1@gmail.com",
            "username": "test-patient-1",
            "full_name": "Sarah Johnson",
            "password_hash": password_hash,
            "role": "patient",
            "is_active": True,
            "is_verified": True,
        },
        {
            "email": "test-patient-2@gmail.com",
            "username": "test-patient-2",
            "full_name": "Michael Chen",
            "password_hash": password_hash,
            "role": "patient",
            "is_active": True,
            "is_verified": True,
        },
        {
            "email": "test-patient-3@gmail.com",
            "username": "test-patient-3",
            "full_name": "Emily Rodriguez",
            "password_hash": password_hash,
            "role": "patient",
            "is_active": True,
            "is_verified": True,
        },
        {
            "email": "test-patient-4@gmail.com",
            "username": "test-patient-4",
            "full_name": "David Thompson",
            "password_hash": password_hash,
            "role": "patient",
            "is_active": True,
            "is_verified": True,
        },
    ]

    users = []
    for data in users_data:
        user = User(**data)
        await user.insert()
        users.append(user)

    return users


async def create_doctors(users: List[User]) -> List[Doctor]:
    """Create doctor profiles"""
    doctors_data = [
        {
            "user": users[0],  # Dr. Sarah Smith
            "specialty": "Internal Medicine",
            "hospital": "City Medical Center",
            "experience_years": 15,
            "license_number": "MD-12345",
            "accepting_new_patients": True,
            "availability": "Available Today",
            "languages": ["English", "Spanish"],
            "rating": 4.9,
            "review_count": 156,
            "distance": "0.5 miles",
        },
        {
            "user": users[1],  # Dr. Michael Chen
            "specialty": "Cardiology",
            "hospital": "Heart Health Institute",
            "experience_years": 20,
            "license_number": "MD-23456",
            "accepting_new_patients": True,
            "availability": "Next available: Nov 25",
            "languages": ["English", "Mandarin"],
            "rating": 4.8,
            "review_count": 203,
            "distance": "1.2 miles",
        },
        {
            "user": users[2],  # Dr. Emily Rodriguez
            "specialty": "Pediatrics",
            "hospital": "Children's Health Center",
            "experience_years": 10,
            "license_number": "MD-34567",
            "accepting_new_patients": True,
            "availability": "Available Tomorrow",
            "languages": ["English", "Spanish", "Portuguese"],
            "rating": 5.0,
            "review_count": 89,
            "distance": "2.1 miles",
        },
        {
            "user": users[3],  # Dr. James Wilson
            "specialty": "Orthopedics",
            "hospital": "Orthopedic Specialists",
            "experience_years": 18,
            "license_number": "MD-45678",
            "accepting_new_patients": False,
            "availability": "Next available: Dec 1",
            "languages": ["English"],
            "rating": 4.7,
            "review_count": 142,
            "distance": "3.5 miles",
        },
        {
            "user": users[4],  # Dr. Lisa Patel
            "specialty": "Dermatology",
            "hospital": "Skin Care Clinic",
            "experience_years": 12,
            "license_number": "MD-56789",
            "accepting_new_patients": True,
            "availability": "Available Today",
            "languages": ["English", "Hindi", "Gujarati"],
            "rating": 4.9,
            "review_count": 198,
            "distance": "1.8 miles",
        },
    ]

    doctors = []
    for data in doctors_data:
        doctor = Doctor(**data)
        await doctor.insert()
        doctors.append(doctor)

    return doctors


async def create_patients(users: List[User]) -> List[Patient]:
    """Create patient profiles"""
    patients_data = [
        {
            "user": users[5],  # Sarah Johnson
            "age": 45,
            "gender": "Female",
            "phone": "+1 (555) 123-4567",
            "address": "123 Main St, San Francisco, CA 94102",
            "blood_type": "A+",
            "height": "5'6\"",
            "weight": "145 lbs",
            "status": "active",
            "last_visit": datetime(2025, 11, 15),
        },
        {
            "user": users[6],  # Michael Chen
            "age": 62,
            "gender": "Male",
            "phone": "+1 (555) 234-5678",
            "address": "456 Oak Ave, San Francisco, CA 94103",
            "blood_type": "O+",
            "height": "5'10\"",
            "weight": "180 lbs",
            "status": "active",
            "last_visit": datetime(2025, 11, 10),
        },
        {
            "user": users[7],  # Emily Rodriguez
            "age": 28,
            "gender": "Female",
            "phone": "+1 (555) 345-6789",
            "address": "789 Pine St, San Francisco, CA 94104",
            "blood_type": "B+",
            "height": "5'4\"",
            "weight": "130 lbs",
            "status": "active",
            "last_visit": datetime(2025, 10, 25),
        },
        {
            "user": users[8],  # David Thompson
            "age": 55,
            "gender": "Male",
            "phone": "+1 (555) 456-7890",
            "address": "321 Elm St, San Francisco, CA 94105",
            "blood_type": "AB+",
            "height": "6'0\"",
            "weight": "200 lbs",
            "status": "inactive",
            "last_visit": datetime(2025, 9, 15),
        },
    ]

    patients = []
    for data in patients_data:
        patient = Patient(**data)
        await patient.insert()
        patients.append(patient)

    return patients


async def create_prescriptions(
    patients: List[Patient], doctors: List[Doctor], pharmacies: List[Pharmacy]
) -> List[Prescription]:
    """Create prescription records"""
    prescriptions_data = [
        {
            "patient": patients[0],  # Sarah Johnson
            "doctor": doctors[0],  # Dr. Sarah Smith
            "medication": "Lisinopril",
            "generic_name": "Lisinopril",
            "dosage": "10mg",
            "frequency": "Once daily",
            "duration": "90 days",
            "prescribed_date": datetime(2025, 11, 1),
            "expiry_date": datetime(2026, 2, 1),
            "status": "active",
            "instructions": "Take with or without food",
            "refills": 2,
            "refills_remaining": 2,
            "pharmacy_name": pharmacies[0].name,
            "pharmacy_address": pharmacies[0].address,
            "pharmacy_phone": pharmacies[0].phone,
            "warnings": ["May cause dizziness"],
            "side_effects": ["Dizziness", "Fatigue"],
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "doctor": doctors[0],  # Dr. Sarah Smith
            "medication": "Metformin",
            "generic_name": "Metformin",
            "dosage": "500mg",
            "frequency": "Twice daily",
            "duration": "90 days",
            "prescribed_date": datetime(2025, 11, 1),
            "expiry_date": datetime(2026, 2, 1),
            "status": "active",
            "instructions": "Take with meals",
            "refills": 2,
            "refills_remaining": 2,
            "pharmacy_name": pharmacies[0].name,
            "pharmacy_address": pharmacies[0].address,
            "pharmacy_phone": pharmacies[0].phone,
            "warnings": ["Take with food to reduce stomach upset"],
            "side_effects": ["Nausea", "Diarrhea"],
        },
        {
            "patient": patients[1],  # Michael Chen
            "doctor": doctors[0],  # Dr. Sarah Smith
            "medication": "Atorvastatin",
            "generic_name": "Atorvastatin",
            "dosage": "20mg",
            "frequency": "Once daily",
            "duration": "90 days",
            "prescribed_date": datetime(2025, 10, 28),
            "expiry_date": datetime(2026, 1, 28),
            "status": "active",
            "instructions": "Take at bedtime",
            "refills": 3,
            "refills_remaining": 3,
            "pharmacy_name": pharmacies[0].name,
            "pharmacy_address": pharmacies[0].address,
            "pharmacy_phone": pharmacies[0].phone,
            "warnings": ["Avoid alcohol"],
            "side_effects": ["Muscle pain", "Liver problems"],
        },
        {
            "patient": patients[2],  # Emily Rodriguez
            "doctor": doctors[0],  # Dr. Sarah Smith
            "medication": "Albuterol Inhaler",
            "generic_name": "Albuterol",
            "dosage": "90mcg",
            "frequency": "As needed",
            "duration": "30 days",
            "prescribed_date": datetime(2025, 10, 25),
            "expiry_date": datetime(2025, 11, 15),
            "status": "active",
            "instructions": "Use as needed for shortness of breath",
            "refills": 0,
            "refills_remaining": 0,
            "pharmacy_name": pharmacies[1].name,
            "pharmacy_address": pharmacies[1].address,
            "pharmacy_phone": pharmacies[1].phone,
            "warnings": ["Use only as needed"],
            "side_effects": ["Rapid heartbeat", "Tremors"],
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "doctor": doctors[0],  # Dr. Sarah Smith
            "medication": "Amoxicillin",
            "generic_name": "Amoxicillin",
            "dosage": "500mg",
            "frequency": "Three times daily",
            "duration": "10 days",
            "prescribed_date": datetime(2025, 10, 15),
            "expiry_date": datetime(2025, 10, 25),
            "status": "completed",
            "instructions": "Take with food",
            "refills": 0,
            "refills_remaining": 0,
            "pharmacy_name": pharmacies[0].name,
            "pharmacy_address": pharmacies[0].address,
            "pharmacy_phone": pharmacies[0].phone,
            "warnings": ["Complete full course"],
            "side_effects": ["Diarrhea", "Nausea"],
        },
        {
            "patient": patients[3],  # David Thompson
            "doctor": doctors[0],  # Dr. Sarah Smith
            "medication": "Ibuprofen",
            "generic_name": "Ibuprofen",
            "dosage": "400mg",
            "frequency": "As needed",
            "duration": "14 days",
            "prescribed_date": datetime(2025, 9, 20),
            "expiry_date": datetime(2025, 10, 4),
            "status": "completed",
            "instructions": "Take with food or milk",
            "refills": 0,
            "refills_remaining": 0,
            "pharmacy_name": pharmacies[2].name,
            "pharmacy_address": pharmacies[2].address,
            "pharmacy_phone": pharmacies[2].phone,
            "warnings": ["May cause stomach bleeding"],
            "side_effects": ["Stomach upset", "Dizziness"],
        },
    ]

    prescriptions = []
    for data in prescriptions_data:
        prescription = Prescription(**data)
        await prescription.insert()
        prescriptions.append(prescription)

    return prescriptions


async def create_conditions(
    patients: List[Patient], doctors: List[Doctor]
) -> List[Condition]:
    """Create medical condition records"""
    conditions_data = [
        {
            "patient": patients[0],  # Sarah Johnson
            "doctor": doctors[0],  # Dr. Sarah Smith
            "name": "Hypertension",
            "diagnosed_date": datetime(2020, 5, 15),
            "status": "active",
            "severity": "moderate",
            "notes": "Well controlled with medication",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "doctor": doctors[0],  # Dr. Sarah Smith
            "name": "Type 2 Diabetes",
            "diagnosed_date": datetime(2021, 8, 20),
            "status": "active",
            "severity": "moderate",
            "notes": "Managed with diet and medication",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "doctor": doctors[1],  # Dr. Michael Chen
            "name": "Seasonal Allergies",
            "diagnosed_date": datetime(2018, 3, 10),
            "status": "active",
            "severity": "mild",
        },
        {
            "patient": patients[1],  # Michael Chen
            "doctor": doctors[0],  # Dr. Sarah Smith
            "name": "High Cholesterol",
            "diagnosed_date": datetime(2019, 6, 10),
            "status": "active",
            "severity": "moderate",
        },
        {
            "patient": patients[2],  # Emily Rodriguez
            "doctor": doctors[2],  # Dr. Emily Rodriguez
            "name": "Asthma",
            "diagnosed_date": datetime(2020, 1, 15),
            "status": "active",
            "severity": "moderate",
        },
        {
            "patient": patients[3],  # David Thompson
            "doctor": doctors[3],  # Dr. James Wilson
            "name": "Arthritis",
            "diagnosed_date": datetime(2018, 9, 5),
            "status": "active",
            "severity": "moderate",
        },
    ]

    conditions = []
    for data in conditions_data:
        condition = Condition(**data)
        await condition.insert()
        conditions.append(condition)

    return conditions


async def create_allergies(patients: List[Patient]) -> List[Allergy]:
    """Create allergy records"""
    allergies_data = [
        {
            "patient": patients[0],  # Sarah Johnson
            "allergen": "Penicillin",
            "reaction": "Rash, itching",
            "severity": "moderate",
            "diagnosed_date": datetime(2015, 6, 12),
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "allergen": "Shellfish",
            "reaction": "Anaphylaxis",
            "severity": "severe",
            "diagnosed_date": datetime(2010, 9, 5),
        },
        {
            "patient": patients[1],  # Michael Chen
            "allergen": "Latex",
            "reaction": "Skin irritation",
            "severity": "mild",
            "diagnosed_date": datetime(2019, 2, 18),
        },
    ]

    allergies = []
    for data in allergies_data:
        allergy = Allergy(**data)
        await allergy.insert()
        allergies.append(allergy)

    return allergies


async def create_surgeries(patients: List[Patient]) -> List[Surgery]:
    """Create surgery records"""
    surgeries_data = [
        {
            "patient": patients[0],  # Sarah Johnson
            "procedure": "Appendectomy",
            "date": datetime(2015, 11, 20),
            "hospital": "City Medical Center",
            "surgeon": "Dr. James Wilson",
            "notes": "Emergency procedure, no complications",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "procedure": "Knee Arthroscopy",
            "date": datetime(2019, 5, 8),
            "hospital": "Orthopedic Specialists",
            "surgeon": "Dr. Robert Lee",
            "notes": "Meniscus repair",
        },
    ]

    surgeries = []
    for data in surgeries_data:
        surgery = Surgery(**data)
        await surgery.insert()
        surgeries.append(surgery)

    return surgeries


async def create_immunizations(patients: List[Patient]) -> List[Immunization]:
    """Create immunization records"""
    immunizations_data = [
        {
            "patient": patients[0],  # Sarah Johnson
            "vaccine": "COVID-19 (Pfizer)",
            "date": datetime(2023, 10, 15),
            "next_due": datetime(2024, 10, 15),
            "provider": "City Medical Center",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "vaccine": "Influenza",
            "date": datetime(2024, 9, 20),
            "next_due": datetime(2025, 9, 20),
            "provider": "CVS Pharmacy",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "vaccine": "Tdap",
            "date": datetime(2022, 3, 10),
            "next_due": datetime(2032, 3, 10),
            "provider": "City Medical Center",
        },
    ]

    immunizations = []
    for data in immunizations_data:
        immunization = Immunization(**data)
        await immunization.insert()
        immunizations.append(immunization)

    return immunizations


async def create_lab_results(
    patients: List[Patient], doctors: List[Doctor]
) -> List[LabResult]:
    """Create lab result records"""
    lab_results_data = [
        {
            "patient": patients[0],  # Sarah Johnson
            "ordered_by": doctors[0],  # Dr. Sarah Smith
            "test": "Complete Blood Count (CBC)",
            "date": datetime(2025, 11, 10),
            "result": "All values within normal range",
            "status": "normal",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "ordered_by": doctors[0],  # Dr. Sarah Smith
            "test": "HbA1c (Diabetes)",
            "date": datetime(2025, 11, 10),
            "result": "6.2% (Good control)",
            "status": "normal",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "ordered_by": doctors[0],  # Dr. Sarah Smith
            "test": "Lipid Panel",
            "date": datetime(2025, 11, 10),
            "result": "Total cholesterol: 210 mg/dL (Elevated)",
            "status": "abnormal",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "ordered_by": doctors[1],  # Dr. Michael Chen
            "test": "Thyroid Function",
            "date": datetime(2025, 11, 15),
            "result": "Pending",
            "status": "pending",
        },
    ]

    lab_results = []
    for data in lab_results_data:
        lab_result = LabResult(**data)
        await lab_result.insert()
        lab_results.append(lab_result)

    return lab_results


async def create_appointments(
    patients: List[Patient], doctors: List[Doctor]
) -> List[Appointment]:
    """Create appointment records"""
    appointments_data = [
        {
            "patient": patients[0],  # Sarah Johnson
            "doctor": doctors[0],  # Dr. Sarah Smith
            "date": datetime(2025, 11, 25, 10, 30),
            "type": "Follow-up",
            "status": "confirmed",
            "duration_minutes": 30,
            "notes": "Follow-up for hypertension and diabetes",
        },
        {
            "patient": patients[0],  # Sarah Johnson
            "doctor": doctors[1],  # Dr. Michael Chen
            "date": datetime(2025, 12, 5, 14, 0),
            "type": "Consultation",
            "status": "upcoming",
            "duration_minutes": 45,
            "notes": "Cardiology consultation",
        },
    ]

    appointments = []
    for data in appointments_data:
        appointment = Appointment(**data)
        await appointment.insert()
        appointments.append(appointment)

    return appointments


async def create_notifications(users: List[User]) -> List[Notification]:
    """Create notification records"""
    # Get patient user (Sarah Johnson - test-patient-1)
    patient_user = next((u for u in users if u.email == "test-patient-1@gmail.com"), None)
    
    if not patient_user:
        return []

    notifications_data = [
        {
            "user": patient_user,
            "type": "prescription",
            "title": "Prescription Refill Ready",
            "description": "Your prescription for Lisinopril 10mg is ready for pickup at CVS Pharmacy.",
            "timestamp": datetime.utcnow() - timedelta(hours=2),
            "read": False,
            "priority": "high",
            "action_url": "/patient/prescriptions/1",
            "action_label": "View Prescription",
        },
        {
            "user": patient_user,
            "type": "appointment",
            "title": "Appointment Reminder",
            "description": "Upcoming appointment with Dr. Sarah Smith tomorrow at 10:30 AM.",
            "timestamp": datetime.utcnow() - timedelta(hours=5),
            "read": False,
            "priority": "high",
            "action_url": "/patient/dashboard",
            "action_label": "View Appointment",
        },
        {
            "user": patient_user,
            "type": "system",
            "title": "Lab Results Available",
            "description": "Your recent blood work results are now available for review.",
            "timestamp": datetime.utcnow() - timedelta(days=1),
            "read": False,
            "priority": "medium",
            "action_url": "/patient/medical-history",
            "action_label": "View Results",
        },
        {
            "user": patient_user,
            "type": "message",
            "title": "New Message from Dr. Smith",
            "description": "Dr. Smith has sent you a message regarding your recent visit.",
            "timestamp": datetime.utcnow() - timedelta(days=2),
            "read": True,
            "priority": "medium",
            "action_url": "/messages/1",
            "action_label": "Read Message",
        },
        {
            "user": patient_user,
            "type": "prescription",
            "title": "Prescription Expiring Soon",
            "description": "Your prescription for Metformin will expire in 7 days. Request a refill now.",
            "timestamp": datetime.utcnow() - timedelta(days=3),
            "read": True,
            "priority": "medium",
            "action_url": "/patient/prescriptions/2",
            "action_label": "Request Refill",
        },
        {
            "user": patient_user,
            "type": "system",
            "title": "Account Security Update",
            "description": "Two-factor authentication is now available. Enable it to secure your account.",
            "timestamp": datetime.utcnow() - timedelta(days=7),
            "read": True,
            "priority": "low",
            "action_url": "/patient/settings",
            "action_label": "Enable 2FA",
        },
    ]

    notifications = []
    for data in notifications_data:
        notification = Notification(**data)
        await notification.insert()
        notifications.append(notification)

    return notifications

