import {
  getUserSettingsInputSchema,
  getUserSettingsOutputSchema,
  updateUserSettingsInputSchema,
  updateUserSettingsOutputSchema,
} from '@/modules/users/shared/user-settings.schemas';
import { z } from 'zod';

export type GetUserSettingsInput = z.infer<typeof getUserSettingsInputSchema>;
export type GetUserSettingsOutput = z.infer<typeof getUserSettingsOutputSchema>;

export type UpdateUserSettingsInput = z.infer<
  typeof updateUserSettingsInputSchema
>;
export type UpdateUserSettingsOutput = z.infer<
  typeof updateUserSettingsOutputSchema
>;
