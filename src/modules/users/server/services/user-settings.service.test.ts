import { createServerClient } from '@/lib/supabase/server';
import { mockUser, mockUserSettings } from '@/test/helpers/fixtures';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getUserSettingsService,
  updateUserSettingsService,
} from './user-settings.service';

describe('User Settings Service', () => {
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    vi.mocked(createServerClient).mockResolvedValue(mockClient as never);
  });

  describe('getUserSettingsService', () => {
    it('should return user settings', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserSettings,
        error: null,
      });

      const result = await getUserSettingsService();

      expect(result).toEqual(mockUserSettings);
      expect(mockClient._queryBuilder.eq).toHaveBeenCalledWith(
        'user_id',
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

      await expect(getUserSettingsService()).rejects.toThrow();
    });
  });

  describe('updateUserSettingsService', () => {
    it('should update defaultOrganizationId', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: { defaultOrganizationId: 'new-org-id' },
        error: null,
      });

      const result = await updateUserSettingsService({
        defaultOrganizationId: 'new-org-id',
      });

      expect(result.defaultOrganizationId).toBe('new-org-id');
      expect(mockClient._queryBuilder.update).toHaveBeenCalledWith({
        default_organization_id: 'new-org-id',
      });
    });

    it('should accept null as defaultOrganizationId', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: { defaultOrganizationId: null },
        error: null,
      });

      const result = await updateUserSettingsService({
        defaultOrganizationId: null,
      });

      expect(result.defaultOrganizationId).toBeNull();
      expect(mockClient._queryBuilder.update).toHaveBeenCalledWith({
        default_organization_id: null,
      });
    });

    it('should return current settings when no updates provided', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockUserSettings,
        error: null,
      });

      const result = await updateUserSettingsService({});

      expect(result).toEqual(mockUserSettings);
      expect(mockClient._queryBuilder.update).not.toHaveBeenCalled();
    });

    it('should throw when supabase update fails', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: null,
        error: new Error('Update failed'),
      });

      await expect(
        updateUserSettingsService({ defaultOrganizationId: 'new-org' })
      ).rejects.toThrow();
    });
  });
});
