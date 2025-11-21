/**
 * HTTP utility functions for making API calls with TanStack Query
 */
import { AxiosError as AxiosErrorClass } from "axios";
import api from "../services/api";
import type { ApiResponse, ApiError } from "../types";

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosErrorClass) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      errors: error.response?.data?.errors,
    };
  }
  return {
    status: 500,
    message: "An unexpected error occurred",
  };
};

/**
 * Generic GET request
 */
export const httpGet = async <T>(url: string, config = {}) => {
  const response = await api.get<T | ApiResponse<T>>(url, config);
  // FastAPI returns data directly, not wrapped in ApiResponse
  // Check if response.data has a data property (wrapped) or return directly
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return (response.data as ApiResponse<T>).data;
  }
  return response.data as T;
};

/**
 * Generic POST request
 */
export const httpPost = async <T, D = unknown>(
  url: string,
  data?: D,
  config = {}
) => {
  const response = await api.post<T | ApiResponse<T>>(url, data, config);
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return (response.data as ApiResponse<T>).data;
  }
  return response.data as T;
};

/**
 * Generic PUT request
 */
export const httpPut = async <T, D = unknown>(
  url: string,
  data?: D,
  config = {}
) => {
  const response = await api.put<T | ApiResponse<T>>(url, data, config);
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return (response.data as ApiResponse<T>).data;
  }
  return response.data as T;
};

/**
 * Generic PATCH request
 */
export const httpPatch = async <T, D = unknown>(
  url: string,
  data?: D,
  config = {}
) => {
  const response = await api.patch<T | ApiResponse<T>>(url, data, config);
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return (response.data as ApiResponse<T>).data;
  }
  return response.data as T;
};

/**
 * Generic DELETE request
 */
export const httpDelete = async <T>(url: string, config = {}) => {
  const response = await api.delete<T | ApiResponse<T>>(url, config);
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return (response.data as ApiResponse<T>).data;
  }
  return response.data as T;
};
