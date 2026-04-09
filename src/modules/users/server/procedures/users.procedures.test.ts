import { createServerClient } from '@/lib/supabase/server';
import { mockUser, mockUserProfile } from '@/test/helpers/fixtures';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { createRouterClient } from '@orpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usersRoutes } from '../routes/users.routes';

const client = createRouterClient(usersRoutes);

describe('Users Procedures (Integration)', () => {
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    vi.mocked(createServerClient).mockResolvedValue(mockClient as never);
  });

  function authenticateUser() {
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  }

  function unauthenticateUser() {
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Unauthorized' },
    });
  }

  describe('users.get', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(client.users.get({})).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should return user profile', async () => {
      authenticateUser();
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserProfile,
        error: null,
      });

      const result = await client.users.get({});

      expect(result).toEqual({
        ...mockUserProfile,
        email: mockUser.email,
      });
    });
  });

  describe('users.update', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(
        client.users.update({ firstName: 'Jane' })
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });

    it('should update user profile', async () => {
      authenticateUser();
      mockClient.auth.updateUser.mockResolvedValue({ error: null });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: { ...mockUserProfile, firstName: 'Jane' },
        error: null,
      });

      const result = await client.users.update({ firstName: 'Jane' });

      expect(result.firstName).toBe('Jane');
    });

    it('should reject invalid email format', async () => {
      authenticateUser();

      await expect(
        client.users.update({ email: 'not-an-email' })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });
  });
});
