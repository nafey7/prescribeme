import React, { useState } from "react";
import { Badge, Tabs } from "../../common";
import type { Tab } from "../../common/Tabs";
import { useApiGet } from "../../../hooks/useApi";

interface Condition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: "active" | "resolved";
  severity: "mild" | "moderate" | "severe";
  doctor: string;
  notes?: string;
}

interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
  diagnosedDate: string;
}

interface Surgery {
  id: string;
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  notes?: string;
}

interface Immunization {
  id: string;
  vaccine: string;
  date: string;
  nextDue?: string;
  provider: string;
}

interface LabResult {
  id: string;
  test: string;
  date: string;
  result: string;
  status: "normal" | "abnormal" | "pending";
  orderedBy: string;
}

const MedicalHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState("conditions");

  // Fetch medical history from API
  const { data: medicalHistoryData, isLoading } = useApiGet<{
    conditions: Condition[];
    allergies: Allergy[];
    surgeries: Surgery[];
    immunizations: Immunization[];
    labResults: LabResult[];
  }>("medical-history", "/api/v1/patients/medical-history");

  // Commented out hardcoded data - now using API
  // const conditions: Condition[] = [
  //   {
  //     id: '1',
  //     name: 'Hypertension',
  //     diagnosedDate: '2020-05-15',
  //     status: 'active',
  //     severity: 'moderate',
  //     doctor: 'Dr. Sarah Smith',
  //     notes: 'Well controlled with medication',
  //   },
  //   {
  //     id: '2',
  //     name: 'Type 2 Diabetes',
  //     diagnosedDate: '2021-08-20',
  //     status: 'active',
  //     severity: 'moderate',
  //     doctor: 'Dr. Sarah Smith',
  //     notes: 'Managed with diet and medication',
  //   },
  //   {
  //     id: '3',
  //     name: 'Seasonal Allergies',
  //     diagnosedDate: '2018-03-10',
  //     status: 'active',
  //     severity: 'mild',
  //     doctor: 'Dr. Michael Chen',
  //   },
  // ];

  // const allergies: Allergy[] = [
  //   {
  //     id: '1',
  //     allergen: 'Penicillin',
  //     reaction: 'Rash, itching',
  //     severity: 'moderate',
  //     diagnosedDate: '2015-06-12',
  //   },
  //   {
  //     id: '2',
  //     allergen: 'Shellfish',
  //     reaction: 'Anaphylaxis',
  //     severity: 'severe',
  //     diagnosedDate: '2010-09-05',
  //   },
  //   {
  //     id: '3',
  //     allergen: 'Latex',
  //     reaction: 'Skin irritation',
  //     severity: 'mild',
  //     diagnosedDate: '2019-02-18',
  //   },
  // ];

  // const surgeries: Surgery[] = [
  //   {
  //     id: '1',
  //     procedure: 'Appendectomy',
  //     date: '2015-11-20',
  //     hospital: 'City Medical Center',
  //     surgeon: 'Dr. James Wilson',
  //     notes: 'Emergency procedure, no complications',
  //   },
  //   {
  //     id: '2',
  //     procedure: 'Knee Arthroscopy',
  //     date: '2019-05-08',
  //     hospital: 'Orthopedic Specialists',
  //     surgeon: 'Dr. Robert Lee',
  //     notes: 'Meniscus repair',
  //   },
  // ];

  // const immunizations: Immunization[] = [
  //   {
  //     id: '1',
  //     vaccine: 'COVID-19 (Pfizer)',
  //     date: '2023-10-15',
  //     nextDue: '2024-10-15',
  //     provider: 'City Medical Center',
  //   },
  //   {
  //     id: '2',
  //     vaccine: 'Influenza',
  //     date: '2024-09-20',
  //     nextDue: '2025-09-20',
  //     provider: 'CVS Pharmacy',
  //   },
  //   {
  //     id: '3',
  //     vaccine: 'Tdap',
  //     date: '2022-03-10',
  //     nextDue: '2032-03-10',
  //     provider: 'City Medical Center',
  //   },
  // ];

  // const labResults: LabResult[] = [
  //   {
  //     id: '1',
  //     test: 'Complete Blood Count (CBC)',
  //     date: '2025-11-10',
  //     result: 'All values within normal range',
  //     status: 'normal',
  //     orderedBy: 'Dr. Sarah Smith',
  //   },
  //   {
  //     id: '2',
  //     test: 'HbA1c (Diabetes)',
  //     date: '2025-11-10',
  //     result: '6.2% (Good control)',
  //     status: 'normal',
  //     orderedBy: 'Dr. Sarah Smith',
  //   },
  //   {
  //     id: '3',
  //     test: 'Lipid Panel',
  //     date: '2025-11-10',
  //     result: 'Total cholesterol: 210 mg/dL (Elevated)',
  //     status: 'abnormal',
  //     orderedBy: 'Dr. Sarah Smith',
  //   },
  //   {
  //     id: '4',
  //     test: 'Thyroid Function',
  //     date: '2025-11-15',
  //     result: 'Pending',
  //     status: 'pending',
  //     orderedBy: 'Dr. Michael Chen',
  //   },
  // ];

  // Use API data or fallback to empty arrays
  const conditions = medicalHistoryData?.conditions || [];
  const allergies = medicalHistoryData?.allergies || [];
  const surgeries = medicalHistoryData?.surgeries || [];
  const immunizations = medicalHistoryData?.immunizations || [];
  const labResults = medicalHistoryData?.labResults || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading medical history...</div>
      </div>
    );
  }

  const tabs: Tab[] = [
    { key: "conditions", label: "Conditions" },
    { key: "allergies", label: "Allergies" },
    { key: "surgeries", label: "Surgeries" },
    { key: "immunizations", label: "Immunizations" },
    { key: "labs", label: "Lab Results" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your complete medical history and health records
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-red-600"
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
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Conditions
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {conditions.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
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
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Known Allergies
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {allergies.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Past Surgeries
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {surgeries.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Immunizations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {immunizations.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-6">
          {/* Conditions Tab */}
          {activeTab === "conditions" && (
            <div className="space-y-4">
              {conditions.map((condition) => (
                <div
                  key={condition.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {condition.name}
                        </h3>
                        <Badge
                          variant={
                            condition.status === "active" ? "info" : "success"
                          }
                        >
                          {condition.status}
                        </Badge>
                        <Badge
                          variant={
                            condition.severity === "severe"
                              ? "danger"
                              : condition.severity === "moderate"
                              ? "warning"
                              : "default"
                          }
                        >
                          {condition.severity}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Diagnosed on{" "}
                        {new Date(condition.diagnosedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}{" "}
                        by {condition.doctor}
                      </p>
                      {condition.notes && (
                        <p className="mt-2 text-sm text-gray-700">
                          {condition.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Allergies Tab */}
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
                        <h3 className="text-lg font-semibold text-gray-900">
                          {allergy.allergen}
                        </h3>
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
                      <p className="mt-1 text-sm text-gray-600">
                        Diagnosed on{" "}
                        {new Date(allergy.diagnosedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Surgeries Tab */}
          {activeTab === "surgeries" && (
            <div className="space-y-4">
              {surgeries.map((surgery) => (
                <div
                  key={surgery.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {surgery.procedure}
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(surgery.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Hospital</p>
                          <p className="font-medium text-gray-900">
                            {surgery.hospital}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Surgeon</p>
                          <p className="font-medium text-gray-900">
                            {surgery.surgeon}
                          </p>
                        </div>
                      </div>
                      {surgery.notes && (
                        <p className="mt-3 text-sm text-gray-700">
                          {surgery.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Immunizations Tab */}
          {activeTab === "immunizations" && (
            <div className="space-y-4">
              {immunizations.map((immunization) => (
                <div
                  key={immunization.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {immunization.vaccine}
                      </h3>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Date Given</p>
                          <p className="font-medium text-gray-900">
                            {new Date(immunization.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        {immunization.nextDue && (
                          <div>
                            <p className="text-gray-500">Next Due</p>
                            <p className="font-medium text-gray-900">
                              {new Date(
                                immunization.nextDue
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-500">Provider</p>
                          <p className="font-medium text-gray-900">
                            {immunization.provider}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lab Results Tab */}
          {activeTab === "labs" && (
            <div className="space-y-4">
              {labResults.map((lab) => (
                <div
                  key={lab.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lab.test}
                        </h3>
                        <Badge
                          variant={
                            lab.status === "normal"
                              ? "success"
                              : lab.status === "abnormal"
                              ? "warning"
                              : "info"
                          }
                        >
                          {lab.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {new Date(lab.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        • Ordered by {lab.orderedBy}
                      </p>
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        Result: {lab.result}
                      </p>
                    </div>
                    {lab.status !== "pending" && (
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View Report
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
