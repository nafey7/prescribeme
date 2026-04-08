"""Ensure CareRelationship rows exist for every prescription (idempotent)."""
from app.models import Prescription, CareRelationship


async def sync_care_relationships_from_prescriptions() -> None:
    prescriptions = await Prescription.find().to_list()
    for presc in prescriptions:
        await presc.fetch_all_links()
        doc = presc.doctor
        pat = presc.patient
        if doc is None or pat is None:
            continue
        existing = await CareRelationship.find_one(
            CareRelationship.doctor.id == doc.id,
            CareRelationship.patient.id == pat.id,
        )
        if not existing:
            await CareRelationship(doctor=doc, patient=pat).insert()
