import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';

/**
 * Wrapper around React Hook Form with built-in Zod validation
 */
export function useForm<T extends Record<string, any> = Record<string, any>>(
  schema: ZodSchema,
  defaultValues?: Partial<T>,
  options?: any
) {
  return useReactHookForm<T>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: defaultValues as any,
    ...options,
  });
}
