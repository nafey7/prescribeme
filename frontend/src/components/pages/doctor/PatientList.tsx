import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar, Table, Badge, Button } from "../../common";
import type { Column } from "../../common/Table";
import { useApiGet } from "../../../hooks/useApi";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  lastVisit: string;
  status: "active" | "inactive";
  conditions?: string[];
}

// Commented out hardcoded data - now using API
// const mockPatients: Patient[] = [
//   {
//     id: '1',
//     name: 'Sarah Johnson',
//     age: 45,
//     gender: 'Female',
//     email: 'sarah.j@email.com',
//     phone: '+1 (555) 123-4567',
//     lastVisit: '2025-11-15',
//     status: 'active',
//     conditions: ['Hypertension', 'Diabetes Type 2'],
//   },
//   {
//     id: '2',
//     name: 'Michael Chen',
//     age: 62,
//     gender: 'Male',
//     email: 'mchen@email.com',
//     phone: '+1 (555) 234-5678',
//     lastVisit: '2025-11-10',
//     status: 'active',
//     conditions: ['High Cholesterol'],
//   },
//   {
//     id: '3',
//     name: 'Emily Rodriguez',
//     age: 28,
//     gender: 'Female',
//     email: 'emily.r@email.com',
//     phone: '+1 (555) 345-6789',
//     lastVisit: '2025-10-25',
//     status: 'active',
//     conditions: ['Asthma'],
//   },
//   {
//     id: '4',
//     name: 'David Thompson',
//     age: 55,
//     gender: 'Male',
//     email: 'd.thompson@email.com',
//     phone: '+1 (555) 456-7890',
//     lastVisit: '2025-09-15',
//     status: 'inactive',
//     conditions: ['Arthritis'],
//   },
// ];

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch patients from API
  const { data: patientsData, isLoading } = useApiGet<Patient[]>(
    ["patients", searchQuery],
    `/api/v1/doctors/patients${
      searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
    }`
  );

  // Use API data or fallback to empty array
  const patients = patientsData || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading patients...</div>
      </div>
    );
  }

  // Filter patients based on search query (client-side for additional filtering)
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients;
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.phone && patient.phone.includes(searchQuery))
    );
  }, [patients, searchQuery]);

  const columns: Column<Patient>[] = [
    {
      key: "name",
      header: "Patient Name",
      render: (patient) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {patient.name}
            </div>
            <div className="text-sm text-gray-500">{patient.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "age",
      header: "Age",
      render: (patient) => (
        <span className="text-gray-900">{patient.age} yrs</span>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      render: (patient) => (
        <span className="text-gray-900">{patient.gender}</span>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      render: (patient) => (
        <span className="text-gray-900">{patient.phone}</span>
      ),
    },
    {
      key: "lastVisit",
      header: "Last Visit",
      render: (patient) => (
        <span className="text-gray-900">
          {new Date(patient.lastVisit).toLocaleDateString("en-US", {
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
      render: (patient) => (
        <Badge variant={patient.status === "active" ? "success" : "default"}>
          {patient.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (patient) => (
        <Button
          size="sm"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/patients/${patient.id}`);
          }}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and search patient records
          </p>
        </div>
        <Button
          variant="primary"
          className="btn-gradient text-white"
          onClick={() => navigate("/dashboard/patients/new")}
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
          Add New Patient
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Patients
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {patients.length}
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
              <p className="text-sm font-medium text-gray-500">
                Active Patients
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {patients.filter((p) => p.status === "active").length}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Reviews
              </p>
              <p className="text-2xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar
            placeholder="Search patients by name, email, or phone..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 max-w-md"
          />
          <div className="flex items-center space-x-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Genders</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={filteredPatients}
          onRowClick={(patient) =>
            navigate(`/dashboard/patients/${patient.id}`)
          }
          emptyMessage={
            searchQuery
              ? "No patients found matching your search."
              : "No patients yet. Add your first patient to get started."
          }
        />
      </div>
    </div>
  );
};

export default PatientList;
