import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import API_BASE_URL from "../../config/api";

/**
 * On full page load, restore session from httpOnly refresh cookie via /auth/refresh.
 */
const AuthBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bootDone, setBootDone] = useState(() => useAuthStore.getState().isAuthenticated);

  useEffect(() => {
    if (useAuthStore.getState().isAuthenticated) {
      return;
    }

    axios
      .post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const { access_token, user } = res.data;
        useAuthStore.getState().login(access_token, user);
      })
      .catch(() => {
        /* no valid session */
      })
      .finally(() => setBootDone(true));
  }, []);

  if (!bootDone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthBootstrap;
