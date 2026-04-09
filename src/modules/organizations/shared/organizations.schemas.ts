import {
  JSON_SCHEMA_INPUT_REGISTRY,
  JSON_SCHEMA_OUTPUT_REGISTRY,
} from '@orpc/zod/zod4';
import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  logoPath: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ownerId: z.string(),
});

export const createOrganizationInputSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  logoPath: z.string().optional(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(createOrganizationInputSchema, {
  examples: [
    {
      name: 'Test organization',
      description: 'Test organization description',
    },
  ],
});

export const getOrganizationInputSchema = z.object({
  organizationId: z.string(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(getOrganizationInputSchema, {
  examples: [
    {
      organizationId: '1',
    },
  ],
});

export const listOrganizationsInputSchema = z.object({});

JSON_SCHEMA_INPUT_REGISTRY.add(listOrganizationsInputSchema, {
  examples: [],
});

export const updateOrganizationInputSchema = z.object({
  organizationId: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  logoPath: z.string().nullable().optional(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(updateOrganizationInputSchema, {
  examples: [
    {
      organizationId: '1',
      name: 'Test organization updated',
      description: 'Test organization description updated',
    },
  ],
});

export const deleteOrganizationInputSchema = z.object({
  organizationId: z.string(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(deleteOrganizationInputSchema, {
  examples: [
    {
      organizationId: '1',
    },
  ],
});

export const getLogoSignedUploadUrlInputSchema = z.object({
  organizationId: z.string(),
});

JSON_SCHEMA_INPUT_REGISTRY.add(getLogoSignedUploadUrlInputSchema, {
  examples: [
    {
      organizationId: '1',
    },
  ],
});

export const getLogoSignedUploadUrlOutputSchema = z.object({
  signedUrl: z.string(),
  token: z.string(),
  path: z.string(),
});

JSON_SCHEMA_OUTPUT_REGISTRY.add(getLogoSignedUploadUrlOutputSchema, {
  examples: [
    {
      signedUrl: 'https://example.com/signed-url',
      token: 'token',
      path: 'path',
    },
  ],
});
