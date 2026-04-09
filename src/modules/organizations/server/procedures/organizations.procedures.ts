import { protectedProcedure } from '@/lib/orpc/procedures';
import { badRequestSchema } from '@/lib/orpc/schemas';
import {
  createOrganizationService,
  deleteOrganizationService,
  getLogoSignedUploadUrlService,
  getOrganizationService,
  listOrganizationsService,
  updateOrganizationService,
} from '@/modules/organizations/server/services/organizations.service';
import {
  createOrganizationInputSchema,
  deleteOrganizationInputSchema,
  getLogoSignedUploadUrlInputSchema,
  getLogoSignedUploadUrlOutputSchema,
  getOrganizationInputSchema,
  listOrganizationsInputSchema,
  organizationSchema,
  updateOrganizationInputSchema,
} from '@/modules/organizations/shared/organizations.schemas';
import { STATUS_CODES } from '@/utils/status-codes';
import { z } from 'zod';

export const createOrganizationProcedure = protectedProcedure
  .route({
    method: 'POST',
    path: '/organizations',
    summary: 'Create a new organization',
    tags: ['Organizations'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(createOrganizationInputSchema)
  .output(organizationSchema)
  .handler(async ({ input }) => {
    return await createOrganizationService(input);
  });

export const getOrganizationProcedure = protectedProcedure
  .route({
    method: 'GET',
    path: '/organizations/{organizationId}',
    summary: 'Get an organization details',
    tags: ['Organizations'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(getOrganizationInputSchema)
  .output(organizationSchema)
  .handler(async ({ input }) => {
    return await getOrganizationService(input);
  });

export const listOrganizationsProcedure = protectedProcedure
  .route({
    method: 'GET',
    path: '/organizations',
    summary: 'List organizations',
    tags: ['Organizations'],
  })
  .input(listOrganizationsInputSchema)
  .output(z.array(organizationSchema))
  .handler(async () => {
    return await listOrganizationsService();
  });

export const updateOrganizationProcedure = protectedProcedure
  .route({
    method: 'PUT',
    path: '/organizations/{organizationId}',
    summary: 'Update an organization',
    tags: ['Organizations'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(updateOrganizationInputSchema)
  .output(organizationSchema)
  .handler(async ({ input }) => {
    return await updateOrganizationService(input);
  });

export const deleteOrganizationProcedure = protectedProcedure
  .route({
    method: 'DELETE',
    path: '/organizations/{organizationId}',
    summary: 'Delete an organization',
    tags: ['Organizations'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(deleteOrganizationInputSchema)
  .output(z.boolean())
  .handler(async ({ input }) => {
    return await deleteOrganizationService(input);
  });

export const getLogoSignedUploadUrlProcedure = protectedProcedure
  .route({
    method: 'POST',
    path: '/organizations/{organizationId}/logo/signed-upload-url',
    summary: 'Get an organization logo signed upload URL',
    tags: ['Organizations'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(getLogoSignedUploadUrlInputSchema)
  .output(getLogoSignedUploadUrlOutputSchema)
  .handler(async ({ input }) => {
    return await getLogoSignedUploadUrlService(input);
  });
