import { z } from 'zod';

export const badRequestSchema = z.object({
  code: z.string().optional(),
  formErrors: z.array(z.string()).optional(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
});

export const unprocessableEntitySchema = z.object({
  code: z.string().optional(),
});
