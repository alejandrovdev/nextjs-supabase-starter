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
import z from 'zod';

export type Organization = z.infer<typeof organizationSchema>;
export type CreateOrganizationInput = z.infer<
  typeof createOrganizationInputSchema
>;
export type GetOrganizationInput = z.infer<typeof getOrganizationInputSchema>;
export type ListOrganizationsInput = z.infer<
  typeof listOrganizationsInputSchema
>;
export type UpdateOrganizationInput = z.infer<
  typeof updateOrganizationInputSchema
>;
export type DeleteOrganizationInput = z.infer<
  typeof deleteOrganizationInputSchema
>;
export type GetLogoSignedUploadUrlInput = z.infer<
  typeof getLogoSignedUploadUrlInputSchema
>;
export type CreateOrganizationOutput = z.infer<typeof organizationSchema>;
export type GetOrganizationOutput = z.infer<typeof organizationSchema>;
export type ListOrganizationsOutput = z.infer<typeof organizationSchema>[];
export type UpdateOrganizationOutput = z.infer<typeof organizationSchema>;
export type DeleteOrganizationOutput = boolean;
export type GetLogoSignedUploadUrlOutput = z.infer<
  typeof getLogoSignedUploadUrlOutputSchema
>;
