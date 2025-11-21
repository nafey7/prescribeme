import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar, Table, Badge, Button } from "../../common";
import type { Column } from "../../common/Table";
import { useApiGet } from "../../../hooks/useApi";

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedDate: string;
  status: "active" | "completed" | "discontinued" | "pending";
  prescribedBy: string;
}

// Commented out hardcoded data - now using API
// const mockPrescriptions: Prescription[] = [
//   {
//     id: '1',
//     patientName: 'Sarah Johnson',
//     patientId: '1',
//     medication: 'Lisinopril',
//     dosage: '10mg',
//     frequency: 'Once daily',
//     duration: '90 days',
//     prescribedDate: '2025-11-01',
//     status: 'active',
//     prescribedBy: 'Dr. Smith',
//   },
//   {
//     id: '2',
//     patientName: 'Sarah Johnson',
//     patientId: '1',
//     medication: 'Metformin',
//     dosage: '500mg',
//     frequency: 'Twice daily',
//     duration: '90 days',
//     prescribedDate: '2025-11-01',
//     status: 'active',
//     prescribedBy: 'Dr. Smith',
//   },
//   {
//     id: '3',
//     patientName: 'Michael Chen',
//     patientId: '2',
//     medication: 'Atorvastatin',
//     dosage: '20mg',
//     frequency: 'Once daily',
//     duration: '90 days',
//     prescribedDate: '2025-10-28',
//     status: 'active',
//     prescribedBy: 'Dr. Smith',
//   },
//   {
//     id: '4',
//     patientName: 'Emily Rodriguez',
//     patientId: '3',
//     medication: 'Albuterol Inhaler',
//     dosage: '90mcg',
//     frequency: 'As needed',
//     duration: '30 days',
//     prescribedDate: '2025-10-25',
//     status: 'active',
//     prescribedBy: 'Dr. Smith',
//   },
//   {
//     id: '5',
//     patientName: 'Sarah Johnson',
//     patientId: '1',
//     medication: 'Amoxicillin',
//     dosage: '500mg',
//     frequency: 'Three times daily',
//     duration: '10 days',
//     prescribedDate: '2025-10-15',
//     status: 'completed',
//     prescribedBy: 'Dr. Smith',
//   },
//   {
//     id: '6',
//     patientName: 'David Thompson',
//     patientId: '4',
//     medication: 'Ibuprofen',
//     dosage: '400mg',
//     frequency: 'As needed',
//     duration: '14 days',
//     prescribedDate: '2025-09-20',
//     status: 'completed',
//     prescribedBy: 'Dr. Smith',
//   },
// ];

const PrescriptionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch prescriptions from API
  const { data: prescriptionsData, isLoading } = useApiGet<Prescription[]>(
    ["prescriptions", statusFilter, searchQuery],
    `/api/v1/doctors/prescriptions${
      statusFilter && statusFilter !== "all" ? `?status=${statusFilter}` : ""
    }${
      searchQuery
        ? `${
            statusFilter && statusFilter !== "all" ? "&" : "?"
          }search=${encodeURIComponent(searchQuery)}`
        : ""
    }`
  );

  // Use API data or fallback to empty array
  const prescriptions = prescriptionsData || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading prescriptions...</div>
      </div>
    );
  }

  // Filter prescriptions based on search query (client-side for additional filtering)
  const filteredPrescriptions = useMemo(() => {
    if (!searchQuery) return prescriptions;
    return prescriptions.filter((prescription) => {
      const matchesSearch =
        prescription.patientName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        prescription.medication
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || prescription.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [prescriptions, searchQuery, statusFilter]);

  const columns: Column<Prescription>[] = [
    {
      key: "patientName",
      header: "Patient",
      render: (prescription) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {prescription.patientName}
          </div>
          <div className="text-xs text-gray-500">
            ID: {prescription.patientId}
          </div>
        </div>
      ),
    },
    {
      key: "medication",
      header: "Medication",
      render: (prescription) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {prescription.medication}
          </div>
          <div className="text-xs text-gray-500">
            {prescription.dosage} - {prescription.frequency}
          </div>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (prescription) => (
        <span className="text-sm text-gray-900">{prescription.duration}</span>
      ),
    },
    {
      key: "prescribedDate",
      header: "Prescribed Date",
      render: (prescription) => (
        <span className="text-sm text-gray-900">
          {new Date(prescription.prescribedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (prescription) => {
        const variants = {
          active: "success" as const,
          completed: "default" as const,
          discontinued: "warning" as const,
          pending: "info" as const,
        };
        return (
          <Badge variant={variants[prescription.status]}>
            {prescription.status}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (prescription) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/prescriptions/${prescription.id}`);
            }}
          >
            View
          </Button>
          {prescription.status === "active" && (
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/prescriptions/${prescription.id}/edit`);
              }}
            >
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Calculate statistics
  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter((p) => p.status === "active").length,
    completed: prescriptions.filter((p) => p.status === "completed").length,
    thisMonth: prescriptions.filter((p) => {
      const prescribedDate = new Date(p.prescribedDate);
      const now = new Date();
      return (
        prescribedDate.getMonth() === now.getMonth() &&
        prescribedDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Prescription History
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all prescriptions
          </p>
        </div>
        <Button
          variant="primary"
          className="btn-gradient text-white"
          onClick={() => navigate("/dashboard/prescriptions/new")}
        >
          <svg
            className="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Prescription
        </Button>
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
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-purple-600"
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
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.thisMonth}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar
            placeholder="Search by patient name or medication..."
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
              <option value="discontinued">Discontinued</option>
              <option value="pending">Pending</option>
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

      {/* Prescriptions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={filteredPrescriptions}
          onRowClick={(prescription) =>
            navigate(`/dashboard/prescriptions/${prescription.id}`)
          }
          emptyMessage={
            searchQuery
              ? "No prescriptions found matching your search."
              : "No prescriptions yet. Create your first prescription to get started."
          }
        />
      </div>
    </div>
  );
};

export default PrescriptionHistory;
