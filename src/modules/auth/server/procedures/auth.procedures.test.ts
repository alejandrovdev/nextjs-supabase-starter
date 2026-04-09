import { createServerClient } from '@/lib/supabase/server';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { createRouterClient } from '@orpc/server';
import { AuthError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authRoutes } from '../routes/auth.routes';

const client = createRouterClient(authRoutes);

describe('Auth Procedures (Integration)', () => {
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    vi.mocked(createServerClient).mockResolvedValue(mockClient as never);
  });

  describe('auth.signUpWithEmail', () => {
    it('should succeed with valid input', async () => {
      mockClient.auth.signUp.mockResolvedValue({ error: null });

      const result = await client.auth.signUpWithEmail({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });

      expect(result).toBe(true);
    });

    it('should reject invalid email', async () => {
      await expect(
        client.auth.signUpWithEmail({
          email: 'not-an-email',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });

    it('should reject missing required fields', async () => {
      await expect(
        // @ts-expect-error — testing missing fields
        client.auth.signUpWithEmail({
          email: 'test@example.com',
        })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });

    it('should reject short password', async () => {
      await expect(
        client.auth.signUpWithEmail({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: '123',
        })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });

    it('should propagate AuthError as proper error response', async () => {
      mockClient.auth.signUp.mockResolvedValue({
        error: new AuthError('User already registered', 422),
      });

      await expect(
        client.auth.signUpWithEmail({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        })
      ).rejects.toMatchObject({ code: 'UNPROCESSABLE_ENTITY' });
    });
  });

  describe('auth.loginWithEmail', () => {
    it('should succeed with valid credentials', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({ error: null });

      const result = await client.auth.loginWithEmail({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toBe(true);
    });

    it('should reject invalid email', async () => {
      await expect(
        client.auth.loginWithEmail({
          email: 'bad-email',
          password: 'password123',
        })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });

    it('should reject empty password', async () => {
      await expect(
        client.auth.loginWithEmail({
          email: 'test@example.com',
          password: '',
        })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });

    it('should propagate invalid credentials error', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        error: new AuthError('Invalid login credentials', 400),
      });

      await expect(
        client.auth.loginWithEmail({
          email: 'test@example.com',
          password: 'wrong',
        })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });
  });

  describe('auth.forgotPassword', () => {
    it('should succeed with valid email', async () => {
      mockClient.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await client.auth.forgotPassword({
        email: 'test@example.com',
      });

      expect(result).toBe(true);
    });

    it('should reject invalid email', async () => {
      await expect(
        client.auth.forgotPassword({ email: 'not-valid' })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });
  });

  describe('auth.updatePassword', () => {
    it('should succeed with valid password', async () => {
      mockClient.auth.updateUser.mockResolvedValue({ error: null });

      const result = await client.auth.updatePassword({
        password: 'newPassword123',
      });

      expect(result).toBe(true);
    });

    it('should reject short password', async () => {
      await expect(
        client.auth.updatePassword({ password: '12' })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });
  });

  describe('auth.logout', () => {
    it('should succeed', async () => {
      mockClient.auth.signOut.mockResolvedValue({ error: null });

      const result = await client.auth.logout({});

      expect(result).toBe(true);
    });
  });
});
