import { ORPCError } from '@orpc/client';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export function onFormError<T extends FieldValues>(
  error: unknown,
  form: UseFormReturn<T>,
  fallbackMessage = 'An error occurred'
) {
  if (error instanceof ORPCError) {
    if (error.code === 'BAD_REQUEST' && error.data?.fieldErrors) {
      const formErrors = error.data.fieldErrors as Record<
        keyof Path<T>,
        string[]
      >;

      Object.entries(formErrors).forEach(([key, value]) => {
        form.setError(key as Path<T>, {
          type: 'server',
          message: value[0],
        });
      });
    }

    toast.error(error.message);
  } else {
    toast.error(fallbackMessage);
  }
}
