import { createServerClient } from '@/lib/supabase/server';
import { STATUS_CODES } from '@/utils/status-codes';
import { ORPCError, os, ValidationError } from '@orpc/server';
import { AuthError } from '@supabase/supabase-js';
import { z } from 'zod';

const errorMiddleware = os.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof ORPCError) {
      if (
        error.code === STATUS_CODES[400] &&
        error.cause instanceof ValidationError
      ) {
        const zodError = new z.ZodError(
          error.cause.issues as z.core.$ZodIssue[]
        );

        throw new ORPCError(STATUS_CODES[400], {
          status: 400,
          message: error.message,
          data: z.flattenError(zodError),
        });
      }

      throw error;
    }

    if (error instanceof AuthError) {
      const status = STATUS_CODES[error.status || 500];

      throw new ORPCError(status, {
        status: error.status,
        message: error.message,
        data: {
          code: error.code,
        },
      });
    }

    throw new ORPCError(STATUS_CODES[500]);
  }
});

export const baseProcedure = os.use(errorMiddleware).errors({
  INTERNAL_SERVER_ERROR: {
    code: STATUS_CODES[500],
    message: 'Internal server error',
  },
});

export const protectedProcedure = baseProcedure
  .use(async ({ next }) => {
    const supabase = await createServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new ORPCError(STATUS_CODES[401], {
        message: 'Unauthorized',
      });
    }

    return next();
  })
  .errors({
    UNAUTHORIZED: {
      code: STATUS_CODES[401],
      message: 'Unauthorized',
    },
  });
