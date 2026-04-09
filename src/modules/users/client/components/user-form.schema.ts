import { z } from 'zod';

export const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(255),
  lastName: z.string().min(1, 'Last name is required').max(255),
  email: z.email('Invalid email address').max(255),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
