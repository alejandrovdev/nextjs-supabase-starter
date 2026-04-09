import { createServerClient } from '@/lib/supabase/server';
import { mockUser, mockUserSettings } from '@/test/helpers/fixtures';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { createRouterClient } from '@orpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { userSettingsRoutes } from '../routes/user-settings.routes';

const client = createRouterClient(userSettingsRoutes);

describe('User Settings Procedures (Integration)', () => {
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

  describe('userSettings.get', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(client.userSettings.get({})).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should return user settings', async () => {
      authenticateUser();
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserSettings,
        error: null,
      });

      const result = await client.userSettings.get({});

      expect(result).toEqual(mockUserSettings);
    });
  });

  describe('userSettings.update', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(
        client.userSettings.update({ defaultOrganizationId: 'org-123' })
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });

    it('should update default organization', async () => {
      authenticateUser();
      mockClient._queryBuilder.single.mockResolvedValue({
        data: { defaultOrganizationId: 'new-org-id' },
        error: null,
      });

      const result = await client.userSettings.update({
        defaultOrganizationId: 'new-org-id',
      });

      expect(result.defaultOrganizationId).toBe('new-org-id');
    });

    it('should accept null as defaultOrganizationId', async () => {
      authenticateUser();
      mockClient._queryBuilder.single.mockResolvedValue({
        data: { defaultOrganizationId: null },
        error: null,
      });

      const result = await client.userSettings.update({
        defaultOrganizationId: null,
      });

      expect(result.defaultOrganizationId).toBeNull();
    });
  });
});
