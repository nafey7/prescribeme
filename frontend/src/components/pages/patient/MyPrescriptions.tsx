import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar, Badge, Button } from "../../common";
import { useApiGet } from "../../../hooks/useApi";

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  doctor: string;
  prescribedDate: string;
  expiryDate: string;
  status: "active" | "completed" | "expired";
  refillsRemaining: number;
  pharmacy: string;
}

const MyPrescriptions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch prescriptions from API
  const { data: prescriptionsData, isLoading } = useApiGet<Prescription[]>(
    ["prescriptions", statusFilter],
    `/api/v1/patients/prescriptions${
      statusFilter && statusFilter !== "all" ? `?status=${statusFilter}` : ""
    }`
  );

  // Commented out hardcoded data - now using API
  // const prescriptions: Prescription[] = [
  //   {
  //     id: '1',
  //     medication: 'Lisinopril',
  //     dosage: '10mg',
  //     frequency: 'Once daily',
  //     doctor: 'Dr. Sarah Smith',
  //     prescribedDate: '2025-11-01',
  //     expiryDate: '2026-02-01',
  //     status: 'active',
  //     refillsRemaining: 2,
  //     pharmacy: 'CVS Pharmacy - Main Street',
  //   },
  //   {
  //     id: '2',
  //     medication: 'Metformin',
  //     dosage: '500mg',
  //     frequency: 'Twice daily',
  //     doctor: 'Dr. Sarah Smith',
  //     prescribedDate: '2025-11-01',
  //     expiryDate: '2026-02-01',
  //     status: 'active',
  //     refillsRemaining: 2,
  //     pharmacy: 'CVS Pharmacy - Main Street',
  //   },
  //   {
  //     id: '3',
  //     medication: 'Albuterol Inhaler',
  //     dosage: '90mcg',
  //     frequency: 'As needed',
  //     doctor: 'Dr. Michael Chen',
  //     prescribedDate: '2025-10-15',
  //     expiryDate: '2025-11-15',
  //     status: 'active',
  //     refillsRemaining: 0,
  //     pharmacy: 'Walgreens - Downtown',
  //   },
  //   {
  //     id: '4',
  //     medication: 'Amoxicillin',
  //     dosage: '500mg',
  //     frequency: 'Three times daily',
  //     doctor: 'Dr. Sarah Smith',
  //     prescribedDate: '2025-09-20',
  //     expiryDate: '2025-09-30',
  //     status: 'completed',
  //     refillsRemaining: 0,
  //     pharmacy: 'CVS Pharmacy - Main Street',
  //   },
  //   {
  //     id: '5',
  //     medication: 'Ibuprofen',
  //     dosage: '400mg',
  //     frequency: 'As needed',
  //     doctor: 'Dr. Emily Rodriguez',
  //     prescribedDate: '2025-08-10',
  //     expiryDate: '2025-09-10',
  //     status: 'expired',
  //     refillsRemaining: 0,
  //     pharmacy: 'Rite Aid - Park Avenue',
  //   },
  // ];

  // Use API data or fallback to empty array
  const prescriptions = prescriptionsData || [];

  // Filter prescriptions
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((prescription) => {
      const matchesSearch =
        prescription.medication
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        prescription.doctor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || prescription.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [prescriptions, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading prescriptions...</div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter((p) => p.status === "active").length,
    completed: prescriptions.filter((p) => p.status === "completed").length,
    needsRefill: prescriptions.filter(
      (p) => p.status === "active" && p.refillsRemaining === 0
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all your prescriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-primary-600"
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
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Prescriptions
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.active}
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completed}
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
              <p className="text-sm font-medium text-gray-500">Needs Refill</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.needsRefill}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar
            placeholder="Search prescriptions by medication or doctor..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 max-w-md"
          />
          <div className="flex items-center space-x-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
            <Button variant="secondary" size="sm">
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 transition-colors cursor-pointer"
            onClick={() =>
              navigate(`/patient/prescriptions/${prescription.id}`)
            }
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {prescription.medication}
                  </h3>
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
                  {prescription.refillsRemaining === 0 &&
                    prescription.status === "active" && (
                      <Badge variant="warning">Refill Needed</Badge>
                    )}
                </div>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Dosage</p>
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.dosage}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Frequency</p>
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prescribed By</p>
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.doctor}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pharmacy</p>
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.pharmacy}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
                  <span>
                    Prescribed:{" "}
                    {new Date(prescription.prescribedDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                  <span>•</span>
                  <span>
                    {prescription.status === "active"
                      ? `Expires: ${new Date(
                          prescription.expiryDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}`
                      : `Expired: ${new Date(
                          prescription.expiryDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}`}
                  </span>
                  {prescription.refillsRemaining > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        {prescription.refillsRemaining} refills remaining
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/patient/prescriptions/${prescription.id}`);
                  }}
                >
                  View Details
                </Button>
                {prescription.status === "active" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle refill request
                    }}
                  >
                    Request Refill
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredPrescriptions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No prescriptions found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search or filter criteria."
                : "You don't have any prescriptions yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;
