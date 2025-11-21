import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Modal } from "../../common";
import { useApiGet } from "../../../hooks/useApi";

interface DosageSchedule {
  time: string;
  taken: boolean;
}

const PrescriptionDetail: React.FC = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const [showRefillModal, setShowRefillModal] = useState(false);

  // Fetch prescription details from API
  const { data: prescriptionData, isLoading } = useApiGet<{
    id: string;
    medication: string;
    genericName?: string;
    dosage: string;
    frequency: string;
    duration: string;
    prescribedDate: string;
    expiryDate: string;
    status: string;
    refillsRemaining: number;
    totalRefills: number;
    instructions?: string;
    warnings: string[];
    sideEffects: string[];
    interactions: string[];
    doctor: {
      name: string;
      specialty: string;
      phone?: string;
      email?: string;
    };
    pharmacy: {
      name: string;
      address?: string;
      phone?: string;
      hours?: string;
    };
  }>(
    ["prescription", prescriptionId || ""],
    `/api/v1/patients/prescriptions/${prescriptionId}`
  );

  // Commented out hardcoded data - now using API
  // const prescription = {
  //   id: prescriptionId,
  //   medication: 'Lisinopril',
  //   genericName: 'Lisinopril',
  //   dosage: '10mg',
  //   frequency: 'Once daily',
  //   duration: '90 days',
  //   prescribedDate: '2025-11-01',
  //   expiryDate: '2026-02-01',
  //   status: 'active',
  //   refillsRemaining: 2,
  //   totalRefills: 3,
  //   instructions: 'Take with or without food. Take at the same time each day.',
  //   warnings: [
  //     'May cause dizziness. Avoid driving until you know how this medication affects you.',
  //     'Avoid alcohol while taking this medication.',
  //     'Notify your doctor if you experience persistent cough or swelling.',
  //   ],
  //   sideEffects: ['Dizziness', 'Headache', 'Fatigue', 'Cough'],
  //   interactions: [
  //     'Potassium supplements',
  //     'NSAIDs (e.g., ibuprofen)',
  //     'Lithium',
  //   ],
  //   doctor: {
  //     name: 'Dr. Sarah Smith',
  //     specialty: 'Internal Medicine',
  //     phone: '(555) 123-4567',
  //     email: 'dr.smith@hospital.com',
  //   },
  //   pharmacy: {
  //     name: 'CVS Pharmacy',
  //     address: '123 Main Street, San Francisco, CA 94102',
  //     phone: '(555) 987-6543',
  //     hours: 'Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-6PM',
  //   },
  // };

  // Use API data or fallback
  const prescription = prescriptionData || {
    id: prescriptionId || "",
    medication: "",
    genericName: "",
    dosage: "",
    frequency: "",
    duration: "",
    prescribedDate: "",
    expiryDate: "",
    status: "active",
    refillsRemaining: 0,
    totalRefills: 0,
    instructions: "",
    warnings: [],
    sideEffects: [],
    interactions: [],
    doctor: { name: "", specialty: "", phone: "", email: "" },
    pharmacy: { name: "", address: "", phone: "", hours: "" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading prescription details...</div>
      </div>
    );
  }

  const dosageSchedule: DosageSchedule[] = [
    { time: "8:00 AM", taken: true },
    { time: "8:00 AM (Tomorrow)", taken: false },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500">
        <button
          onClick={() => navigate("/patient/prescriptions")}
          className="hover:text-gray-700"
        >
          My Prescriptions
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{prescription.medication}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {prescription.medication}
              </h1>
              <Badge
                variant={
                  prescription.status === "active"
                    ? "success"
                    : prescription.status === "completed"
                    ? "default"
                    : "danger"
                }
              >
                {prescription.status}
              </Badge>
            </div>
            <p className="mt-1 text-lg text-gray-600">
              {prescription.genericName}
            </p>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Prescribed on{" "}
                {new Date(prescription.prescribedDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
              <span>•</span>
              <span className="flex items-center">
                Expires{" "}
                {new Date(prescription.expiryDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              variant="primary"
              className="btn-gradient text-white"
              onClick={() => setShowRefillModal(true)}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Request Refill
            </Button>
            <Button variant="secondary">
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dosage Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Dosage Information
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Dosage</p>
                <p className="text-lg font-semibold text-gray-900">
                  {prescription.dosage}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Frequency</p>
                <p className="text-lg font-semibold text-gray-900">
                  {prescription.frequency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-lg font-semibold text-gray-900">
                  {prescription.duration}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Instructions
              </h3>
              <p className="text-sm text-gray-700">
                {prescription.instructions}
              </p>
            </div>
          </div>

          {/* Dosage Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Dosage Schedule
            </h2>
            <div className="space-y-3">
              {dosageSchedule.map((dose, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        dose.taken ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {dose.taken ? (
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {dose.time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {prescription.dosage} - {prescription.medication}
                      </p>
                    </div>
                  </div>
                  {dose.taken ? (
                    <Badge variant="success">Taken</Badge>
                  ) : (
                    <Button variant="secondary" size="sm">
                      Mark as Taken
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {prescription.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                    Important Warnings
                  </h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {prescription.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Side Effects & Interactions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Possible Side Effects
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                {prescription.sideEffects.map((effect, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                    {effect}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Drug Interactions
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                {prescription.interactions.map((interaction, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                    {interaction}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Refill Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Refill Information
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Refills Used</span>
                  <span className="font-medium text-gray-900">
                    {prescription.totalRefills - prescription.refillsRemaining}{" "}
                    of {prescription.totalRefills}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{
                      width: `${
                        ((prescription.totalRefills -
                          prescription.refillsRemaining) /
                          prescription.totalRefills) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-900">
                    {prescription.refillsRemaining}
                  </span>{" "}
                  refills remaining
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Prescribing Doctor
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {prescription.doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {prescription.doctor.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {prescription.doctor.specialty}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {prescription.doctor.phone}
                </p>
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {prescription.doctor.email}
                </p>
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-3">
                Contact Doctor
              </Button>
            </div>
          </div>

          {/* Pharmacy Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pharmacy
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900">
                  {prescription.pharmacy.name}
                </p>
                <p className="text-gray-600 mt-1">
                  {prescription.pharmacy.address}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {prescription.pharmacy.phone}
                </p>
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {prescription.pharmacy.hours}
                </p>
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-3">
                Change Pharmacy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Refill Request Modal */}
      <Modal
        isOpen={showRefillModal}
        onClose={() => setShowRefillModal(false)}
        title="Request Prescription Refill"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Your refill request will be sent to {prescription.doctor.name} and{" "}
              {prescription.pharmacy.name} for approval.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Prescription Details
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900">
                {prescription.medication}
              </p>
              <p className="text-sm text-gray-600">
                {prescription.dosage} - {prescription.frequency}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Refills remaining: {prescription.refillsRemaining}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Any special instructions or notes..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowRefillModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="btn-gradient text-white"
              onClick={() => {
                // Handle refill request
                setShowRefillModal(false);
              }}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PrescriptionDetail;
