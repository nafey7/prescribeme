import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const location = useLocation();
  const isPatientArea = location.pathname.startsWith("/patient");

  const doctorLinks = [
    { to: "/dashboard", label: "Dashboard", short: "📊" },
    { to: "/dashboard/patients", label: "Patients", short: "👥" },
    { to: "/dashboard/prescriptions", label: "Prescriptions", short: "💊" },
    { to: "/dashboard/notifications", label: "Notifications", short: "🔔" },
    { to: "/dashboard/doctor-settings", label: "Settings", short: "⚙️" },
    { to: "/dashboard/help", label: "Help", short: "❓" },
  ];

  const patientLinks = [
    { to: "/patient", label: "Home", short: "🏠" },
    { to: "/patient/prescriptions", label: "Prescriptions", short: "💊" },
    { to: "/patient/doctors", label: "Find doctors", short: "🩺" },
    { to: "/patient/medical-history", label: "Medical history", short: "📋" },
    { to: "/patient/notifications", label: "Notifications", short: "🔔" },
    { to: "/patient/settings", label: "Settings", short: "⚙️" },
    { to: "/patient/help", label: "Help", short: "❓" },
  ];

  const links =
    user?.role === "patient" || isPatientArea ? patientLinks : doctorLinks;

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } bg-gray-900 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-xl font-bold">PrescribeMe</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-800"
          aria-label="Toggle sidebar"
          type="button"
        >
          ☰
        </button>
      </div>

      <nav className="mt-8">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block px-4 py-2 hover:bg-gray-800 transition"
          >
            {sidebarOpen ? item.label : item.short}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
