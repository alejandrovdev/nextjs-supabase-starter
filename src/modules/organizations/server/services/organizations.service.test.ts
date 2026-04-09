import { createAdminClient, createServerClient } from '@/lib/supabase/server';
import {
  mockOrganization,
  mockOrganizationOwnedByOther,
  mockOrganizationWithLogo,
  mockUser,
} from '@/test/helpers/fixtures';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { ORPCError } from '@orpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createOrganizationService,
  deleteOrganizationService,
  getLogoSignedUploadUrlService,
  getOrganizationService,
  listOrganizationsService,
  updateOrganizationService,
} from './organizations.service';

describe('Organizations Service', () => {
  let mockClient: MockSupabaseClient;
  let mockAdminClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    mockAdminClient = createMockSupabaseClient();
    vi.mocked(createServerClient).mockResolvedValue(mockClient as never);
    vi.mocked(createAdminClient).mockReturnValue(mockAdminClient as never);
  });

  describe('createOrganizationService', () => {
    const input = {
      name: 'New Org',
      description: 'A new org',
      logoPath: undefined,
    };

    it('should create an organization with the authenticated user as owner', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: { ...mockOrganization, name: input.name },
        error: null,
      });

      const result = await createOrganizationService(input);

      expect(result.name).toBe(input.name);
      expect(mockClient.from).toHaveBeenCalledWith('organizations');
      expect(mockClient._queryBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: input.name,
          owner_id: mockUser.id,
        })
      );
    });

    it('should throw UNAUTHORIZED when user is not authenticated', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(createOrganizationService(input)).rejects.toThrow(ORPCError);
      await expect(createOrganizationService(input)).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should throw when supabase insert fails', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValue({
        data: null,
        error: new Error('Insert failed'),
      });

      await expect(createOrganizationService(input)).rejects.toThrow();
    });
  });

  describe('getOrganizationService', () => {
    const input = { organizationId: 'org-uuid-123' };

    it('should return organization data', async () => {
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockOrganization,
        error: null,
      });

      const result = await getOrganizationService(input);

      expect(result).toEqual(mockOrganization);
      expect(mockClient._queryBuilder.eq).toHaveBeenCalledWith(
        'id',
        input.organizationId
      );
    });

    it('should throw NOT_FOUND when organization does not exist', async () => {
      mockClient._queryBuilder.single.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(getOrganizationService(input)).rejects.toThrow(ORPCError);
      await expect(getOrganizationService(input)).rejects.toMatchObject({
        code: 'NOT_FOUND',
      });
    });

    it('should throw when supabase query fails', async () => {
      mockClient._queryBuilder.single.mockResolvedValue({
        data: null,
        error: new Error('Query failed'),
      });

      await expect(getOrganizationService(input)).rejects.toThrow();
    });
  });

  describe('listOrganizationsService', () => {
    it('should return array of organizations', async () => {
      mockClient._queryBuilder.select.mockResolvedValue({
        data: [mockOrganization],
        error: null,
      });

      const result = await listOrganizationsService();

      expect(result).toEqual([mockOrganization]);
    });

    it('should return empty array when no organizations exist', async () => {
      mockClient._queryBuilder.select.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await listOrganizationsService();

      expect(result).toEqual([]);
    });

    it('should throw when supabase query fails', async () => {
      mockClient._queryBuilder.select.mockResolvedValue({
        data: null,
        error: new Error('Query failed'),
      });

      await expect(listOrganizationsService()).rejects.toThrow();
    });
  });

  describe('updateOrganizationService', () => {
    const input = {
      organizationId: 'org-uuid-123',
      name: 'Updated Org',
    };

    it('should update organization when user is owner', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      // First call: getOrganizationService (ownership check)
      mockClient._queryBuilder.single
        .mockResolvedValueOnce({
          data: mockOrganization,
          error: null,
        })
        // Second call: the actual update
        .mockResolvedValueOnce({
          data: { ...mockOrganization, name: 'Updated Org' },
          error: null,
        });

      const result = await updateOrganizationService(input);

      expect(result.name).toBe('Updated Org');
      expect(mockClient._queryBuilder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Org',
          updated_at: expect.any(String),
        })
      );
    });

    it('should throw FORBIDDEN when user is not the owner', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      // getOrganizationService returns org owned by another user
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganizationOwnedByOther,
        error: null,
      });

      await expect(
        updateOrganizationService({
          ...input,
          organizationId: mockOrganizationOwnedByOther.id,
        })
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });

    it('should throw UNAUTHORIZED when user is not authenticated', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(updateOrganizationService(input)).rejects.toThrow(ORPCError);
      await expect(updateOrganizationService(input)).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should return current org when no update fields provided', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      // First call: getOrganizationService (ownership check)
      // Second call: getOrganizationService (no updates, return current)
      mockClient._queryBuilder.single
        .mockResolvedValueOnce({
          data: mockOrganization,
          error: null,
        })
        .mockResolvedValueOnce({
          data: mockOrganization,
          error: null,
        });

      const result = await updateOrganizationService({
        organizationId: 'org-uuid-123',
      });

      expect(result).toEqual(mockOrganization);
      expect(mockClient._queryBuilder.update).not.toHaveBeenCalled();
    });

    it('should delete old logo from storage when logoPath changes', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      // getOrganizationService returns org with existing logo
      mockClient._queryBuilder.single
        .mockResolvedValueOnce({
          data: mockOrganizationWithLogo,
          error: null,
        })
        .mockResolvedValueOnce({
          data: { ...mockOrganizationWithLogo, logoPath: 'new-logo.webp' },
          error: null,
        });

      await updateOrganizationService({
        organizationId: mockOrganizationWithLogo.id,
        logoPath: 'new-logo.webp',
      });

      expect(mockAdminClient.storage.from).toHaveBeenCalledWith('public');
      expect(mockAdminClient._storageBucket.remove).toHaveBeenCalledWith([
        mockOrganizationWithLogo.logoPath,
      ]);
    });

    it('should update description field', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single
        .mockResolvedValueOnce({
          data: mockOrganization,
          error: null,
        })
        .mockResolvedValueOnce({
          data: { ...mockOrganization, description: 'New desc' },
          error: null,
        });

      const result = await updateOrganizationService({
        organizationId: mockOrganization.id,
        description: 'New desc',
      });

      expect(result.description).toBe('New desc');
      expect(mockClient._queryBuilder.update).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'New desc' })
      );
    });

    it('should log error but not throw when storage removal fails', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single
        .mockResolvedValueOnce({
          data: mockOrganizationWithLogo,
          error: null,
        })
        .mockResolvedValueOnce({
          data: { ...mockOrganizationWithLogo, logoPath: 'new-logo.webp' },
          error: null,
        });
      mockAdminClient._storageBucket.remove.mockResolvedValue({
        error: new Error('Storage removal failed'),
      });

      const result = await updateOrganizationService({
        organizationId: mockOrganizationWithLogo.id,
        logoPath: 'new-logo.webp',
      });

      expect(result).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        'updateOrganizationService Storage Error:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should throw when supabase update query fails', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single
        .mockResolvedValueOnce({
          data: mockOrganization,
          error: null,
        })
        .mockResolvedValueOnce({
          data: null,
          error: new Error('Update query failed'),
        });

      await expect(
        updateOrganizationService({ ...input, name: 'Fail' })
      ).rejects.toThrow('Update query failed');
    });

    it('should NOT delete logo when logoPath is the same', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single
        .mockResolvedValueOnce({
          data: mockOrganizationWithLogo,
          error: null,
        })
        .mockResolvedValueOnce({
          data: mockOrganizationWithLogo,
          error: null,
        });

      await updateOrganizationService({
        organizationId: mockOrganizationWithLogo.id,
        logoPath: mockOrganizationWithLogo.logoPath,
      });

      expect(mockAdminClient._storageBucket.remove).not.toHaveBeenCalled();
    });
  });

  describe('deleteOrganizationService', () => {
    const input = { organizationId: 'org-uuid-123' };

    it('should delete organization when user is owner', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      // getOrganizationService
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganization,
        error: null,
      });

      const result = await deleteOrganizationService(input);

      expect(result).toBe(true);
    });

    it('should throw FORBIDDEN when user is not the owner', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganizationOwnedByOther,
        error: null,
      });

      await expect(
        deleteOrganizationService({
          organizationId: mockOrganizationOwnedByOther.id,
        })
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });

    it('should throw UNAUTHORIZED when user is not authenticated', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(deleteOrganizationService(input)).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should throw when supabase delete query fails', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      // getOrganizationService
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganization,
        error: null,
      });
      // delete chain: from().delete().eq() — override eq to return error on second call
      const deleteError = new Error('Delete failed');
      mockClient._queryBuilder.eq
        .mockReturnValueOnce(mockClient._queryBuilder) // first eq: getOrganizationService
        .mockResolvedValueOnce({ error: deleteError }); // second eq: delete

      await expect(deleteOrganizationService(input)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('getLogoSignedUploadUrlService', () => {
    const input = { organizationId: 'org-uuid-123' };

    it('should return signed upload URL when user is owner', async () => {
      const signedUrlData = {
        signedUrl: 'https://example.com/signed-url',
        token: 'upload-token',
        path: 'organizations/logos/org-uuid-123-123456.webp',
      };

      // getOrganizationService (first createServerClient call)
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganization,
        error: null,
      });
      // auth check (second createServerClient call)
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockAdminClient._storageBucket.createSignedUploadUrl.mockResolvedValue({
        data: signedUrlData,
        error: null,
      });

      const result = await getLogoSignedUploadUrlService(input);

      expect(result).toEqual(signedUrlData);
      expect(mockAdminClient.storage.from).toHaveBeenCalledWith('public');
    });

    it('should throw FORBIDDEN when user is not the owner', async () => {
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganizationOwnedByOther,
        error: null,
      });
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      await expect(
        getLogoSignedUploadUrlService({
          organizationId: mockOrganizationOwnedByOther.id,
        })
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });

    it('should throw UNAUTHORIZED when user is not authenticated', async () => {
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganization,
        error: null,
      });
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(getLogoSignedUploadUrlService(input)).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should throw when storage operation fails', async () => {
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganization,
        error: null,
      });
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });
      mockAdminClient._storageBucket.createSignedUploadUrl.mockResolvedValue({
        data: null,
        error: new Error('Storage error'),
      });

      await expect(getLogoSignedUploadUrlService(input)).rejects.toThrow();
    });
  });
});
