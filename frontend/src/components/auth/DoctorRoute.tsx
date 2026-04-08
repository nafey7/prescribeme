import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import RequireAuth from "./RequireAuth";

interface DoctorRouteProps {
  children: React.ReactNode;
}

const DoctorRoute: React.FC<DoctorRouteProps> = ({ children }) => {
  const { user } = useAuthStore();

  return (
    <RequireAuth>
      {user?.role === "doctor" ? (
        children
      ) : (
        <Navigate to="/patient" replace />
      )}
    </RequireAuth>
  );
};

export default DoctorRoute;
