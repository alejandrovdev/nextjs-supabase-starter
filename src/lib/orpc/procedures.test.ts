import { createServerClient } from '@/lib/supabase/server';
import { mockUser } from '@/test/helpers/fixtures';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { createProcedureClient, ORPCError } from '@orpc/server';
import { AuthError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { baseProcedure, protectedProcedure } from './procedures';

describe('Procedures Middleware', () => {
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    vi.mocked(createServerClient).mockResolvedValue(mockClient as never);
  });

  describe('baseProcedure - errorMiddleware', () => {
    it('should convert AuthError to ORPCError with correct status', async () => {
      const procedure = createProcedureClient(
        baseProcedure
          .input(z.object({}))
          .output(z.boolean())
          .handler(async () => {
            throw new AuthError('Invalid credentials', 400);
          })
      );

      await expect(procedure({})).rejects.toThrow(ORPCError);
      await expect(procedure({})).rejects.toMatchObject({
        code: 'BAD_REQUEST',
      });
    });

    it('should convert AuthError 401 to UNAUTHORIZED', async () => {
      const procedure = createProcedureClient(
        baseProcedure
          .input(z.object({}))
          .output(z.boolean())
          .handler(async () => {
            throw new AuthError('Unauthorized', 401);
          })
      );

      await expect(procedure({})).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should fallback AuthError without status to INTERNAL_SERVER_ERROR', async () => {
      const procedure = createProcedureClient(
        baseProcedure
          .input(z.object({}))
          .output(z.boolean())
          .handler(async () => {
            throw new AuthError('Unknown auth error');
          })
      );

      await expect(procedure({})).rejects.toMatchObject({
        code: 'INTERNAL_SERVER_ERROR',
      });
    });

    it('should convert unknown errors to INTERNAL_SERVER_ERROR', async () => {
      const procedure = createProcedureClient(
        baseProcedure
          .input(z.object({}))
          .output(z.boolean())
          .handler(async () => {
            throw new Error('Something unexpected');
          })
      );

      await expect(procedure({})).rejects.toMatchObject({
        code: 'INTERNAL_SERVER_ERROR',
      });
    });

    it('should pass through ORPCError unchanged', async () => {
      const procedure = createProcedureClient(
        baseProcedure
          .input(z.object({}))
          .output(z.boolean())
          .handler(async () => {
            throw new ORPCError('NOT_FOUND', { message: 'Not found' });
          })
      );

      await expect(procedure({})).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Not found',
      });
    });
  });

  describe('protectedProcedure - auth middleware', () => {
    it('should reject with UNAUTHORIZED when getUser returns error', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Unauthorized' },
      });

      const procedure = createProcedureClient(
        protectedProcedure
          .input(z.object({}))
          .output(z.boolean())
          .handler(async () => true)
      );

      await expect(procedure({})).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should reject with UNAUTHORIZED when user is null', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const procedure = createProcedureClient(
        protectedProcedure
          .input(z.object({}))
          .output(z.boolean())
          .handler(async () => true)
      );

      await expect(procedure({})).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should allow request through when user is valid', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const procedure = createProcedureClient(
        protectedProcedure
          .input(z.object({}))
          .output(z.boolean())
          .handler(async () => true)
      );

      const result = await procedure({});

      expect(result).toBe(true);
    });
  });
});
