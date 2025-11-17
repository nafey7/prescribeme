/**
 * Common API Response Type
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Paginated Response Type
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Error Response Type
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * User Type (Example)
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

/**
 * Auth Token Response
 */
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
