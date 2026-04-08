import {
  useForm as useReactHookForm,
  type UseFormProps,
  type Resolver,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";

/**
 * Wrapper around React Hook Form with built-in Zod validation
 */
export function useForm<T extends FieldValues>(
  schema: ZodSchema,
  defaultValues?: Partial<T>,
  options?: Omit<UseFormProps<T>, "resolver" | "defaultValues">
) {
  return useReactHookForm<T>({
    // zod v4 + @hookform/resolvers: library types disagree; runtime is correct
    resolver: zodResolver(schema as never) as Resolver<T>,
    defaultValues: defaultValues as UseFormProps<T>["defaultValues"],
    ...options,
  });
}
