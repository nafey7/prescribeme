/**
 * HTTP utility functions for making API calls with TanStack Query
 */
import { AxiosError as AxiosErrorClass } from 'axios';
import api from '../services/api';
import type { ApiResponse, ApiError } from '../types';

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
    message: 'An unexpected error occurred',
  };
};

/**
 * Generic GET request
 */
export const httpGet = async <T,>(url: string, config = {}) => {
  const response = await api.get<ApiResponse<T>>(url, config);
  return response.data.data;
};

/**
 * Generic POST request
 */
export const httpPost = async <T, D = unknown>(url: string, data?: D, config = {}) => {
  const response = await api.post<ApiResponse<T>>(url, data, config);
  return response.data.data;
};

/**
 * Generic PUT request
 */
export const httpPut = async <T, D = unknown>(url: string, data?: D, config = {}) => {
  const response = await api.put<ApiResponse<T>>(url, data, config);
  return response.data.data;
};

/**
 * Generic PATCH request
 */
export const httpPatch = async <T, D = unknown>(url: string, data?: D, config = {}) => {
  const response = await api.patch<ApiResponse<T>>(url, data, config);
  return response.data.data;
};

/**
 * Generic DELETE request
 */
export const httpDelete = async <T,>(url: string, config = {}) => {
  const response = await api.delete<ApiResponse<T>>(url, config);
  return response.data.data;
};
