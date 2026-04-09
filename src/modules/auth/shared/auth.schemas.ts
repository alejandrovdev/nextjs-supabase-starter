import { JSON_SCHEMA_INPUT_REGISTRY } from '@orpc/zod/zod4';
import z from 'zod';

export const signUpWithEmailSchema = z.object({
  email: z.email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

JSON_SCHEMA_INPUT_REGISTRY.add(signUpWithEmailSchema, {
  examples: [
    {
      email: 'email@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    },
  ],
});

export const loginWithEmailSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

JSON_SCHEMA_INPUT_REGISTRY.add(loginWithEmailSchema, {
  examples: [
    {
      email: 'email@example.com',
      password: 'password',
    },
  ],
});

export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

JSON_SCHEMA_INPUT_REGISTRY.add(forgotPasswordSchema, {
  examples: [
    {
      email: 'email@example.com',
    },
  ],
});

export const updatePasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  tokenHash: z.string().optional(),
  type: z.string().optional(),
  next: z.string().optional(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(updatePasswordSchema, {
  examples: [
    {
      password: 'new_password',
      tokenHash: 'token_hash_from_email',
      type: 'recovery',
      next: 'http://localhost:3000',
    },
  ],
});
