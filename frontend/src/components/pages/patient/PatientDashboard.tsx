import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button } from "../../common";
import { useApiGet } from "../../../hooks/useApi";

interface ActivePrescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  doctor: string;
  daysRemaining: number;
  nextDose: string;
}

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: "upcoming" | "confirmed";
}

interface Activity {
  id: string;
  type: "prescription" | "appointment" | "test";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch dashboard data from API
  const { data: dashboardData, isLoading } = useApiGet<{
    activePrescriptions: ActivePrescription[];
    upcomingAppointments: Appointment[];
    recentActivity: Activity[];
    stats: {
      activePrescriptions: number;
      appointments: number;
      doctors: number;
      labResults: number;
    };
  }>("patient-dashboard", "/api/v1/patients/dashboard");

  // Commented out hardcoded data - now using API
  // const activePrescriptions: ActivePrescription[] = [
  //   {
  //     id: '1',
  //     medication: 'Lisinopril',
  //     dosage: '10mg',
  //     frequency: 'Once daily',
  //     doctor: 'Dr. Sarah Smith',
  //     daysRemaining: 45,
  //     nextDose: '8:00 AM',
  //   },
  //   {
  //     id: '2',
  //     medication: 'Metformin',
  //     dosage: '500mg',
  //     frequency: 'Twice daily',
  //     doctor: 'Dr. Sarah Smith',
  //     daysRemaining: 45,
  //     nextDose: '8:00 AM, 8:00 PM',
  //   },
  // ];

  // const upcomingAppointments: Appointment[] = [
  //   {
  //     id: '1',
  //     doctor: 'Dr. Sarah Smith',
  //     specialty: 'Internal Medicine',
  //     date: '2025-11-25',
  //     time: '10:30 AM',
  //     type: 'Follow-up',
  //     status: 'confirmed',
  //   },
  //   {
  //     id: '2',
  //     doctor: 'Dr. Michael Chen',
  //     specialty: 'Cardiology',
  //     date: '2025-12-05',
  //     time: '2:00 PM',
  //     type: 'Consultation',
  //     status: 'upcoming',
  //   },
  // ];

  // const recentActivity: Activity[] = [
  //   {
  //     id: '1',
  //     type: 'prescription',
  //     title: 'New prescription added',
  //     description: 'Lisinopril 10mg prescribed by Dr. Sarah Smith',
  //     timestamp: '2 days ago',
  //     icon: 'prescription',
  //   },
  //   {
  //     id: '2',
  //     type: 'appointment',
  //     title: 'Appointment confirmed',
  //     description: 'Follow-up with Dr. Sarah Smith on Nov 25',
  //     timestamp: '3 days ago',
  //     icon: 'calendar',
  //   },
  //   {
  //     id: '3',
  //     type: 'test',
  //     title: 'Lab results available',
  //     description: 'Blood work results are now available',
  //     timestamp: '1 week ago',
  //     icon: 'clipboard',
  //   },
  // ];

  // Use API data or fallback to empty arrays
  const activePrescriptions = dashboardData?.activePrescriptions || [];
  const upcomingAppointments = dashboardData?.upcomingAppointments || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const stats = dashboardData?.stats || {
    activePrescriptions: 0,
    appointments: 0,
    doctors: 0,
    labResults: 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, John!</h1>
            <p className="mt-1 text-primary-100">
              Here's an overview of your health information
            </p>
          </div>
          <div className="hidden md:block">
            <svg
              className="w-16 h-16 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Prescriptions
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activePrescriptions}
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
              <p className="text-sm font-medium text-gray-500">Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.appointments}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">My Doctors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.doctors}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lab Results</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.labResults}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Prescriptions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Active Prescriptions
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/patient/prescriptions")}
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {activePrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/patient/prescriptions/${prescription.id}`)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prescription.medication}
                        </h3>
                        <Badge variant="success" size="sm">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {prescription.dosage} • {prescription.frequency}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Prescribed by {prescription.doctor}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {prescription.daysRemaining} days left
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Next: {prescription.nextDose}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Appointments
              </h2>
              <Button variant="secondary" size="sm">
                Schedule New
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 rounded-lg p-3 text-center">
                      <p className="text-xs font-medium text-primary-600">
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                          }
                        )}
                      </p>
                      <p className="text-2xl font-bold text-primary-600">
                        {new Date(appointment.date).getDate()}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {appointment.doctor}
                      </h3>
                      <Badge
                        variant={
                          appointment.status === "confirmed"
                            ? "success"
                            : "info"
                        }
                        size="sm"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {appointment.specialty}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.time} • {appointment.type}
                    </p>
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Activity
            </h2>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {activity.type === "prescription" && (
                        <svg
                          className="w-5 h-5 text-gray-600"
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
                      )}
                      {activity.type === "appointment" && (
                        <svg
                          className="w-5 h-5 text-gray-600"
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
                      )}
                      {activity.type === "test" && (
                        <svg
                          className="w-5 h-5 text-gray-600"
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
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              className="w-full mt-6"
              onClick={() => navigate("/patient/activity")}
            >
              View All Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900">
              Medication Reminder
            </h3>
            <p className="text-sm text-blue-800 mt-1">
              Don't forget to take your evening dose of Metformin at 8:00 PM.
              Set up automatic reminders in your profile settings.
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Set Reminder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
