import { baseProcedure } from '@/lib/orpc/procedures';
import {
  badRequestSchema,
  unprocessableEntitySchema,
} from '@/lib/orpc/schemas';
import {
  forgotPasswordService,
  loginWithEmailService,
  logoutService,
  signUpWithEmailService,
  updatePasswordService,
} from '@/modules/auth/server/services/auth.service';
import {
  forgotPasswordSchema,
  loginWithEmailSchema,
  signUpWithEmailSchema,
  updatePasswordSchema,
} from '@/modules/auth/shared/auth.schemas';
import { STATUS_CODES } from '@/utils/status-codes';
import { z } from 'zod';

export const signUpWithEmailProcedure = baseProcedure
  .route({
    path: '/auth/sign-up',
    summary: 'Sign up a new user with email',
    description:
      'After successful sign up, the user will receive a confirmation email',
    tags: ['Authentication'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
    UNPROCESSABLE_ENTITY: {
      status: 422,
      code: STATUS_CODES[422],
      data: unprocessableEntitySchema,
      message: 'Unprocessable entity',
    },
  })
  .input(signUpWithEmailSchema)
  .output(z.boolean())
  .handler(async ({ input }) => {
    return await signUpWithEmailService(input);
  });

export const loginWithEmailProcedure = baseProcedure
  .route({
    path: '/auth/login',
    summary: 'Login a user with email',
    tags: ['Authentication'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(loginWithEmailSchema)
  .output(z.boolean())
  .handler(async ({ input }) => {
    return await loginWithEmailService(input);
  });

export const forgotPasswordProcedure = baseProcedure
  .route({
    path: '/auth/forgot-password',
    summary: 'Forgot password',
    description:
      'After successful forgot password, the user will receive a reset password email. This email will contain a link to reset the password that contains a hash_token.',
    tags: ['Authentication'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(forgotPasswordSchema)
  .output(z.boolean())
  .handler(async ({ input }) => {
    return await forgotPasswordService(input);
  });

export const updatePasswordProcedure = baseProcedure
  .route({
    path: '/auth/update-password',
    summary: 'Update password',
    description:
      'You need to provide the hash_token that you received in the email to reset your password.',
    tags: ['Authentication'],
  })
  .errors({
    BAD_REQUEST: {
      code: STATUS_CODES[400],
      data: badRequestSchema,
      message: 'Bad request',
      status: 400,
    },
  })
  .input(updatePasswordSchema)
  .output(z.boolean())
  .handler(async ({ input }) => {
    return await updatePasswordService(input);
  });

export const logoutProcedure = baseProcedure
  .route({
    path: '/auth/logout',
    summary: 'Logout user',
    tags: ['Authentication'],
  })
  .input(z.object({}))
  .output(z.boolean())
  .handler(async () => {
    return await logoutService();
  });
