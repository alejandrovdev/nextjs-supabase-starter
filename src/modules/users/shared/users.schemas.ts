import { JSON_SCHEMA_INPUT_REGISTRY } from '@orpc/zod/zod4';
import { z } from 'zod';

export const getUserInputSchema = z.object({});

JSON_SCHEMA_INPUT_REGISTRY.add(getUserInputSchema, {
  examples: [{}],
});

export const getUserOutputSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(getUserOutputSchema, {
  examples: [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john.cornor@mail.com',
      firstName: 'John',
      lastName: 'Cornor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
});

export const updateUserInputSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  email: z.email().max(255).optional(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(updateUserInputSchema, {
  examples: [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.new@mail.com',
    },
  ],
});
