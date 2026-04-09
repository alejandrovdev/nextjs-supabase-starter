import { JSON_SCHEMA_INPUT_REGISTRY } from '@orpc/zod/zod4';
import { z } from 'zod';

const DEFAULT_OUTPUT = {
  defaultOrganizationId: '123e4567-e89b-12d3-a456-426614174000',
};

export const userSettingsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  defaultOrganizationId: z.string().nullable(),
});

export const getUserSettingsInputSchema = z.object({});

JSON_SCHEMA_INPUT_REGISTRY.add(getUserSettingsInputSchema, {
  examples: [{}],
});

export const getUserSettingsOutputSchema = z.object({
  defaultOrganizationId: z.string().nullable(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(getUserSettingsOutputSchema, {
  examples: [DEFAULT_OUTPUT],
});

export const updateUserSettingsInputSchema = z.object({
  defaultOrganizationId: z.string().nullable().optional(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(updateUserSettingsInputSchema, {
  examples: [
    {
      defaultOrganizationId: '123e4567-e89b-12d3-a456-426614174000',
    },
  ],
});

export const updateUserSettingsOutputSchema = z.object({
  defaultOrganizationId: z.string().nullable(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(updateUserSettingsOutputSchema, {
  examples: [DEFAULT_OUTPUT],
});
