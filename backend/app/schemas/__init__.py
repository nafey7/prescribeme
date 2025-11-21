"""
Pydantic Schemas Package
"""
from .auth import (
    SignUpRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    UserResponse,
)
from .prescription import (
    ActivePrescriptionResponse,
    PrescriptionListItemResponse,
    PrescriptionDetailResponse,
    PrescriptionHistoryItemResponse,
    DoctorInfo,
    PharmacyInfo,
)
from .patient import (
    PatientListItemResponse,
    PatientProfileResponse,
)
from .doctor import (
    DoctorListItemResponse,
)
from .medical_history import (
    ConditionResponse,
    AllergyResponse,
    SurgeryResponse,
    ImmunizationResponse,
    LabResultResponse,
    MedicalHistoryResponse,
)
from .appointment import (
    AppointmentResponse,
)
from .notification import (
    NotificationResponse,
)
from .dashboard import (
    ActivityResponse,
    PatientDashboardResponse,
)

__all__ = [
    # Auth
    "SignUpRequest",
    "LoginRequest",
    "TokenResponse",
    "RefreshTokenRequest",
    "UserResponse",
    # Prescription
    "ActivePrescriptionResponse",
    "PrescriptionListItemResponse",
    "PrescriptionDetailResponse",
    "PrescriptionHistoryItemResponse",
    "DoctorInfo",
    "PharmacyInfo",
    # Patient
    "PatientListItemResponse",
    "PatientProfileResponse",
    # Doctor
    "DoctorListItemResponse",
    # Medical History
    "ConditionResponse",
    "AllergyResponse",
    "SurgeryResponse",
    "ImmunizationResponse",
    "LabResultResponse",
    "MedicalHistoryResponse",
    # Appointment
    "AppointmentResponse",
    # Notification
    "NotificationResponse",
    # Dashboard
    "ActivityResponse",
    "PatientDashboardResponse",
]

