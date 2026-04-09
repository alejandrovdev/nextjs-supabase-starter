import { createServerClient } from '@/lib/supabase/server';
import { mockUser, mockUserProfile } from '@/test/helpers/fixtures';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { AuthError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getUserService, updateUserService } from './users.service';

describe('Users Service', () => {
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    vi.mocked(createServerClient).mockResolvedValue(mockClient as never);
  });

  describe('getUserService', () => {
    it('should return user profile merged with email from auth', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserProfile,
        error: null,
      });

      const result = await getUserService();

      expect(result).toEqual({
        ...mockUserProfile,
        email: mockUser.email,
      });
      expect(mockClient._queryBuilder.eq).toHaveBeenCalledWith(
        'id',
        mockUser.id
      );
    });

    it('should throw when supabase query fails', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: null,
        error: new Error('Query failed'),
      });

      await expect(getUserService()).rejects.toThrow();
    });
  });

  describe('updateUserService', () => {
    it('should update email only', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient.auth.updateUser.mockResolvedValue({ error: null });
      // getUserService call after update
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserProfile,
        error: null,
      });

      const result = await updateUserService({ email: 'new@example.com' });

      expect(mockClient.auth.updateUser).toHaveBeenCalledWith(
        { email: 'new@example.com' },
        expect.any(Object)
      );
      expect(result.email).toBe(mockUser.email);
    });

    it('should update name fields', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient.auth.updateUser.mockResolvedValue({ error: null });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: { ...mockUserProfile, firstName: 'Jane' },
        error: null,
      });

      const result = await updateUserService({ firstName: 'Jane' });

      expect(mockClient.auth.updateUser).toHaveBeenCalledWith(
        { data: { first_name: 'Jane' } },
        {}
      );
      expect(result.firstName).toBe('Jane');
    });

    it('should update lastName only', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient.auth.updateUser.mockResolvedValue({ error: null });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: { ...mockUserProfile, lastName: 'Smith' },
        error: null,
      });

      const result = await updateUserService({ lastName: 'Smith' });

      expect(mockClient.auth.updateUser).toHaveBeenCalledWith(
        { data: { last_name: 'Smith' } },
        {}
      );
      expect(result.lastName).toBe('Smith');
    });

    it('should update both email and name', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient.auth.updateUser.mockResolvedValue({ error: null });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserProfile,
        error: null,
      });

      await updateUserService({
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      });

      expect(mockClient.auth.updateUser).toHaveBeenCalledWith(
        {
          email: 'new@example.com',
          data: { first_name: 'Jane', last_name: 'Smith' },
        },
        // emailRedirectTo is only set when NEXT_PUBLIC_APP_URL is defined
        process.env.NEXT_PUBLIC_APP_URL
          ? expect.objectContaining({ emailRedirectTo: expect.any(String) })
          : {}
      );
    });

    it('should set emailRedirectTo when NEXT_PUBLIC_APP_URL is defined', async () => {
      const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient.auth.updateUser.mockResolvedValue({ error: null });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserProfile,
        error: null,
      });

      await updateUserService({ email: 'new@example.com' });

      expect(mockClient.auth.updateUser).toHaveBeenCalledWith(
        { email: 'new@example.com' },
        { emailRedirectTo: 'http://localhost:3000/?email_verified=true' }
      );

      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    });

    it('should throw UNAUTHORIZED when user is not authenticated', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(
        updateUserService({ firstName: 'Jane' })
      ).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should throw when auth update fails', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      const authError = new AuthError('Update failed', 500);
      mockClient.auth.updateUser.mockResolvedValue({ error: authError });

      await expect(
        updateUserService({ email: 'new@example.com' })
      ).rejects.toThrow(AuthError);
    });

    it('should skip auth update when no fields are provided', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      // getUserService call (no update, goes straight to return)
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserProfile,
        error: null,
      });

      const result = await updateUserService({});

      expect(mockClient.auth.updateUser).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...mockUserProfile,
        email: mockUser.email,
      });
    });
  });
});
