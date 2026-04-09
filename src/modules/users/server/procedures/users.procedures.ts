import { protectedProcedure } from '@/lib/orpc/procedures';
import { badRequestSchema } from '@/lib/orpc/schemas';
import {
  getUserService,
  updateUserService,
} from '@/modules/users/server/services/users.service';
import {
  getUserInputSchema,
  getUserOutputSchema,
  updateUserInputSchema,
} from '@/modules/users/shared/users.schemas';
import { STATUS_CODES } from '@/utils/status-codes';

export const getUserProcedure = protectedProcedure
  .route({
    method: 'GET',
    path: '/users/profile',
    summary: 'Get user profile',
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
  .input(getUserInputSchema)
  .output(getUserOutputSchema)
  .handler(async () => {
    return await getUserService();
  });

export const updateUserProcedure = protectedProcedure
  .route({
    method: 'PATCH',
    path: '/users/profile',
    summary: 'Update user profile',
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
  .input(updateUserInputSchema)
  .output(getUserOutputSchema)
  .handler(async ({ input }) => {
    return await updateUserService(input);
  });
