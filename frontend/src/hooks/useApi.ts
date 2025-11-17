import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { httpGet, httpPost, httpPut, httpDelete } from '../utils/http';
import type { ApiError } from '../types';

/**
 * Hook for GET requests
 */
export function useApiGet<TData = unknown>(
  key: (string | number)[] | string,
  url: string,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>
) {
  const queryKey = Array.isArray(key) ? key : [key];

  return useQuery<TData, ApiError>({
    queryKey,
    queryFn: () => httpGet<TData>(url),
    ...options,
  });
}

/**
 * Hook for POST requests
 */
export function useApiPost<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: (data) => httpPost<TData, TVariables>(url, data),
    ...options,
  });
}

/**
 * Hook for PUT requests
 */
export function useApiPut<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: (data) => httpPut<TData, TVariables>(url, data),
    ...options,
  });
}

/**
 * Hook for DELETE requests
 */
export function useApiDelete<TData = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, void>, 'mutationFn'>
) {
  return useMutation<TData, ApiError, void>({
    mutationFn: () => httpDelete<TData>(url),
    ...options,
  });
}
