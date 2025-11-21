import { create } from "zustand";
import API_BASE_URL from "../config/api";

/**
 * User interface - camelCase for frontend consistency
 * Backend returns snake_case which we map to camelCase
 */
export interface User {
  id: string;
  email: string;
  username: string;
  name: string; // Mapped from full_name
  role: "patient" | "doctor" | "admin";
  isActive: boolean; // Mapped from is_active
  isVerified: boolean; // Mapped from is_verified
  createdAt: string; // Mapped from created_at
}

/**
 * Backend user response (snake_case) - used for mapping
 */
interface BackendUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

/**
 * Map backend user response (snake_case) to frontend User (camelCase)
 */
function mapBackendUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    username: backendUser.username,
    name: backendUser.full_name,
    role: backendUser.role as "patient" | "doctor" | "admin",
    isActive: backendUser.is_active,
    isVerified: backendUser.is_verified,
    createdAt: backendUser.created_at,
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null; // Stored in memory, not localStorage
  isAuthenticated: boolean;
  isLoading: boolean;

  // Setters
  setUser: (user: User | null) => void;
  setBackendUser: (backendUser: BackendUser) => void; // Helper to map and set
  setAccessToken: (token: string | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;

  // Actions
  login: (accessToken: string, backendUser: BackendUser) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null, // Access token stored in memory only
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user }),

  setBackendUser: (backendUser) => {
    const mappedUser = mapBackendUser(backendUser);
    set({ user: mappedUser });
  },

  setAccessToken: (token) => set({ accessToken: token }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),

  // Helper action: Login with backend response
  login: (accessToken, backendUser) => {
    const mappedUser = mapBackendUser(backendUser);
    set({
      accessToken,
      user: mappedUser,
      isAuthenticated: true,
    });
  },

  // Helper action: Clear auth state
  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  logout: async () => {
    try {
      // Call logout API to revoke refresh token
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Include cookies
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state regardless of API call success
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },
}));

// User type is already exported in the interface above
