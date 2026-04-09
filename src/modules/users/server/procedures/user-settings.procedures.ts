import { protectedProcedure } from '@/lib/orpc/procedures';
import { badRequestSchema } from '@/lib/orpc/schemas';
import {
  getUserSettingsService,
  updateUserSettingsService,
} from '@/modules/users/server/services/user-settings.service';
import {
  getUserSettingsInputSchema,
  getUserSettingsOutputSchema,
  updateUserSettingsInputSchema,
  updateUserSettingsOutputSchema,
} from '@/modules/users/shared/user-settings.schemas';
import { STATUS_CODES } from '@/utils/status-codes';

export const getUserSettingsProcedure = protectedProcedure
  .route({
    method: 'GET',
    path: '/users/settings',
    summary: 'Get user settings',
    tags: ['Users'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(getUserSettingsInputSchema)
  .output(getUserSettingsOutputSchema)
  .handler(async () => {
    return await getUserSettingsService();
  });

export const updateUserSettingsProcedure = protectedProcedure
  .route({
    method: 'PUT',
    path: '/users/settings',
    summary: 'Update user settings',
    tags: ['Users'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(updateUserSettingsInputSchema)
  .output(updateUserSettingsOutputSchema)
  .handler(async ({ input }) => {
    return await updateUserSettingsService(input);
  });
