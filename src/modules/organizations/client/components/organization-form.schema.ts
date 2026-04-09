import { createOrganizationInputSchema } from '@/modules/organizations/shared/organizations.schemas';
import { z } from 'zod';

export const MAX_IMAGE_SIZE = 50 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const organizationFormSchema = createOrganizationInputSchema
  .omit({ logoPath: true })
  .extend({
    logo: z
      .instanceof(File)
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Image must be a PNG, JPEG or WEBP file',
      })
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
        message: 'Image must be less than 50MB',
      })
      .optional()
      .nullable(),
  });

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
