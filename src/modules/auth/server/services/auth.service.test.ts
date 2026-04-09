import { createServerClient } from '@/lib/supabase/server';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { AuthError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  forgotPasswordService,
  loginWithEmailService,
  logoutService,
  signUpWithEmailService,
  updatePasswordService,
} from './auth.service';

describe('Auth Service', () => {
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    vi.mocked(createServerClient).mockResolvedValue(mockClient as never);
  });

  describe('signUpWithEmailService', () => {
    const input = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    it('should return true on successful signup', async () => {
      mockClient.auth.signUp.mockResolvedValue({ error: null });

      const result = await signUpWithEmailService(input);

      expect(result).toBe(true);
      expect(mockClient.auth.signUp).toHaveBeenCalledWith({
        email: input.email,
        password: input.password,
        options: {
          data: {
            first_name: input.firstName,
            last_name: input.lastName,
          },
        },
      });
    });

    it('should throw AuthError when signup fails', async () => {
      const authError = new AuthError('User already registered', 422);
      mockClient.auth.signUp.mockResolvedValue({ error: authError });

      await expect(signUpWithEmailService(input)).rejects.toThrow(AuthError);
    });
  });

  describe('loginWithEmailService', () => {
    const input = { email: 'test@example.com', password: 'password123' };

    it('should return true on successful login', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({ error: null });

      const result = await loginWithEmailService(input);

      expect(result).toBe(true);
      expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: input.email,
        password: input.password,
      });
    });

    it('should throw AuthError on invalid credentials', async () => {
      const authError = new AuthError('Invalid login credentials', 400);
      mockClient.auth.signInWithPassword.mockResolvedValue({
        error: authError,
      });

      await expect(loginWithEmailService(input)).rejects.toThrow(AuthError);
    });
  });

  describe('forgotPasswordService', () => {
    const input = { email: 'test@example.com' };

    it('should return true on success', async () => {
      mockClient.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await forgotPasswordService(input);

      expect(result).toBe(true);
      expect(mockClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        input.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
        }
      );
    });

    it('should throw AuthError on failure', async () => {
      const authError = new AuthError('Rate limit exceeded', 429);
      mockClient.auth.resetPasswordForEmail.mockResolvedValue({
        error: authError,
      });

      await expect(forgotPasswordService(input)).rejects.toThrow(AuthError);
    });
  });

  describe('updatePasswordService', () => {
    const input = { password: 'newPassword123' };

    it('should return true on success', async () => {
      mockClient.auth.updateUser.mockResolvedValue({ error: null });

      const result = await updatePasswordService(input);

      expect(result).toBe(true);
      expect(mockClient.auth.updateUser).toHaveBeenCalledWith({
        password: input.password,
      });
    });

    it('should throw AuthError on failure', async () => {
      const authError = new AuthError('Same password', 422);
      mockClient.auth.updateUser.mockResolvedValue({ error: authError });

      await expect(updatePasswordService(input)).rejects.toThrow(AuthError);
    });
  });

  describe('logoutService', () => {
    it('should return true on success', async () => {
      mockClient.auth.signOut.mockResolvedValue({ error: null });

      const result = await logoutService();

      expect(result).toBe(true);
      expect(mockClient.auth.signOut).toHaveBeenCalled();
    });

    it('should throw AuthError on failure', async () => {
      const authError = new AuthError('Session not found', 400);
      mockClient.auth.signOut.mockResolvedValue({ error: authError });

      await expect(logoutService()).rejects.toThrow(AuthError);
    });
  });
});
