import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import RequireAuth from "./RequireAuth";

interface PatientRouteProps {
  children: React.ReactNode;
}

const PatientRoute: React.FC<PatientRouteProps> = ({ children }) => {
  const { user } = useAuthStore();

  return (
    <RequireAuth>
      {user?.role === "patient" ? (
        children
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </RequireAuth>
  );
};

export default PatientRoute;
