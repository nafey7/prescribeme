import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Badge, Tabs } from "../../common";
import type { Tab } from "../../common/Tabs";
import { useApiGet } from "../../../hooks/useApi";

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedDate: string;
  status: "active" | "completed" | "discontinued";
  notes?: string;
}

interface MedicalHistory {
  id: string;
  condition: string;
  diagnosedDate: string;
  status: "active" | "resolved";
  notes?: string;
}

interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
}

const PatientProfile: React.FC = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch patient profile from API
  const { data: patientData, isLoading: isLoadingPatient } = useApiGet<{
    id: string;
    name: string;
    age?: number;
    gender?: string;
    email: string;
    phone?: string;
    address?: string;
    bloodType?: string;
    height?: string;
    weight?: string;
    lastVisit?: string;
    status: string;
  }>(["patient", patientId || ""], `/api/v1/doctors/patients/${patientId}`);

  // Fetch patient prescriptions
  const { data: prescriptionsData } = useApiGet<Prescription[]>(
    ["patient-prescriptions", patientId || ""],
    `/api/v1/doctors/patients/${patientId}/prescriptions`
  );

  // Fetch patient conditions
  const { data: conditionsData } = useApiGet<MedicalHistory[]>(
    ["patient-conditions", patientId || ""],
    `/api/v1/doctors/patients/${patientId}/conditions`
  );

  // Fetch patient allergies
  const { data: allergiesData } = useApiGet<Allergy[]>(
    ["patient-allergies", patientId || ""],
    `/api/v1/doctors/patients/${patientId}/allergies`
  );

  // Commented out hardcoded data - now using API
  // const patient = {
  //   id: patientId,
  //   name: 'Sarah Johnson',
  //   age: 45,
  //   gender: 'Female',
  //   email: 'sarah.j@email.com',
  //   phone: '+1 (555) 123-4567',
  //   address: '123 Main St, San Francisco, CA 94102',
  //   bloodType: 'A+',
  //   height: '5\'6"',
  //   weight: '145 lbs',
  //   lastVisit: '2025-11-15',
  //   status: 'active',
  // };

  // Use API data or fallback
  const patient = patientData || {
    id: patientId || "",
    name: "",
    age: undefined,
    gender: undefined,
    email: "",
    phone: undefined,
    address: undefined,
    bloodType: undefined,
    height: undefined,
    weight: undefined,
    lastVisit: undefined,
    status: "active",
  };

  if (isLoadingPatient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading patient profile...</div>
      </div>
    );
  }

  // const prescriptions: Prescription[] = [
  //   {
  //     id: '1',
  //     medication: 'Lisinopril',
  //     dosage: '10mg',
  //     frequency: 'Once daily',
  //     duration: '90 days',
  //     prescribedDate: '2025-11-01',
  //     status: 'active',
  //     notes: 'For blood pressure management',
  //   },
  //   {
  //     id: '2',
  //     medication: 'Metformin',
  //     dosage: '500mg',
  //     frequency: 'Twice daily',
  //     duration: '90 days',
  //     prescribedDate: '2025-11-01',
  //     status: 'active',
  //     notes: 'Take with meals',
  //   },
  //   {
  //     id: '3',
  //     medication: 'Amoxicillin',
  //     dosage: '500mg',
  //     frequency: 'Three times daily',
  //     duration: '10 days',
  //     prescribedDate: '2025-10-15',
  //     status: 'completed',
  //   },
  // ];

  const prescriptions = prescriptionsData || [];

  // const medicalHistory: MedicalHistory[] = [
  //   {
  //     id: '1',
  //     condition: 'Hypertension',
  //     diagnosedDate: '2020-05-15',
  //     status: 'active',
  //     notes: 'Well controlled with medication',
  //   },
  //   {
  //     id: '2',
  //     condition: 'Type 2 Diabetes',
  //     diagnosedDate: '2021-08-20',
  //     status: 'active',
  //     notes: 'Diet and medication management',
  //   },
  // ];

  const medicalHistory = conditionsData || [];

  // const allergies: Allergy[] = [
  //   {
  //     id: '1',
  //     allergen: 'Penicillin',
  //     reaction: 'Rash, itching',
  //     severity: 'moderate',
  //   },
  //   {
  //     id: '2',
  //     allergen: 'Shellfish',
  //     reaction: 'Anaphylaxis',
  //     severity: 'severe',
  //   },
  // ];

  const allergies = allergiesData || [];

  const tabs: Tab[] = [
    { key: "overview", label: "Overview" },
    { key: "prescriptions", label: "Prescriptions" },
    { key: "history", label: "Medical History" },
    { key: "allergies", label: "Allergies" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500">
        <button
          onClick={() => navigate("/dashboard/patients")}
          className="hover:text-gray-700"
        >
          Patients
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{patient.name}</span>
      </nav>

      {/* Patient Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-2xl">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.name}
                </h1>
                <Badge
                  variant={patient.status === "active" ? "success" : "default"}
                >
                  {patient.status}
                </Badge>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{patient.age} years old</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span>Blood Type: {patient.bloodType}</span>
              </div>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>{patient.email}</span>
                <span>•</span>
                <span>{patient.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/dashboard/prescriptions/new?patientId=${patientId}`)
              }
            >
              <svg
                className="w-4 h-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              New Prescription
            </Button>
            <Button variant="primary" className="btn-gradient text-white">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Height</p>
            <p className="text-lg font-semibold text-gray-900">
              {patient.height}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="text-lg font-semibold text-gray-900">
              {patient.weight}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Visit</p>
            <p className="text-lg font-semibold text-gray-900">
              {patient.lastVisit
                ? new Date(patient.lastVisit).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Prescriptions</p>
            <p className="text-lg font-semibold text-gray-900">
              {prescriptions.filter((p) => p.status === "active").length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">{patient.address}</p>
                    </div>
                  </div>
                </div>

                {/* Medical Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Medical Summary
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Active Conditions</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {medicalHistory
                          .filter((h) => h.status === "active")
                          .map((h) => (
                            <Badge key={h.id} variant="info">
                              {h.condition}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Known Allergies</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {allergies.map((a) => (
                          <Badge
                            key={a.id}
                            variant={
                              a.severity === "severe" ? "danger" : "warning"
                            }
                          >
                            {a.allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {prescription.medication}
                        </h4>
                        <Badge
                          variant={
                            prescription.status === "active"
                              ? "success"
                              : prescription.status === "completed"
                              ? "default"
                              : "warning"
                          }
                        >
                          {prescription.status}
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Dosage</p>
                          <p className="font-medium text-gray-900">
                            {prescription.dosage}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Frequency</p>
                          <p className="font-medium text-gray-900">
                            {prescription.frequency}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium text-gray-900">
                            {prescription.duration}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Prescribed</p>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              prescription.prescribedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {prescription.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          {prescription.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        navigate(
                          `/dashboard/prescriptions/${prescription.id}/edit`
                        )
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              {medicalHistory.map((history) => (
                <div
                  key={history.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {history.condition}
                        </h4>
                        <Badge
                          variant={
                            history.status === "active" ? "info" : "success"
                          }
                        >
                          {history.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Diagnosed on{" "}
                        {new Date(history.diagnosedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      {history.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "allergies" && (
            <div className="space-y-4">
              {allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {allergy.allergen}
                        </h4>
                        <Badge
                          variant={
                            allergy.severity === "severe"
                              ? "danger"
                              : allergy.severity === "moderate"
                              ? "warning"
                              : "default"
                          }
                        >
                          {allergy.severity}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Reaction:</span>{" "}
                        {allergy.reaction}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  No clinical notes available. Add notes to track important
                  information about this patient.
                </p>
              </div>
              <Button variant="primary">Add Note</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
