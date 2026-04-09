import { createAdminClient, createServerClient } from '@/lib/supabase/server';
import {
  mockOrganization,
  mockOrganizationOwnedByOther,
  mockUser,
} from '@/test/helpers/fixtures';
import {
  createMockSupabaseClient,
  type MockSupabaseClient,
} from '@/test/helpers/mock-supabase';
import { createRouterClient } from '@orpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { organizationsRoutes } from '../routes/organizations.routes';

const client = createRouterClient(organizationsRoutes);

describe('Organizations Procedures (Integration)', () => {
  let mockClient: MockSupabaseClient;
  let mockAdminClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    mockAdminClient = createMockSupabaseClient();
    vi.mocked(createServerClient).mockResolvedValue(mockClient as never);
    vi.mocked(createAdminClient).mockReturnValue(mockAdminClient as never);
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

  describe('organizations.create', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(
        client.organizations.create({ name: 'Test Org' })
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });

    it('should reject empty name', async () => {
      authenticateUser();

      await expect(
        client.organizations.create({ name: '' })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });

    it('should reject name exceeding 100 characters', async () => {
      authenticateUser();

      await expect(
        client.organizations.create({ name: 'a'.repeat(101) })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });

    it('should create organization with valid input', async () => {
      authenticateUser();
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockOrganization,
        error: null,
      });

      const result = await client.organizations.create({ name: 'Test Org' });

      expect(result).toEqual(mockOrganization);
    });
  });

  describe('organizations.get', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(
        client.organizations.get({ organizationId: 'org-123' })
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });

    it('should return organization by id', async () => {
      authenticateUser();
      mockClient._queryBuilder.single.mockResolvedValue({
        data: mockOrganization,
        error: null,
      });

      const result = await client.organizations.get({
        organizationId: 'org-uuid-123',
      });

      expect(result).toEqual(mockOrganization);
    });
  });

  describe('organizations.list', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(client.organizations.list({})).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should return list of organizations', async () => {
      authenticateUser();
      mockClient._queryBuilder.select.mockResolvedValue({
        data: [mockOrganization],
        error: null,
      });

      const result = await client.organizations.list({});

      expect(result).toEqual([mockOrganization]);
    });
  });

  describe('organizations.update', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(
        client.organizations.update({
          organizationId: 'org-123',
          name: 'New',
        })
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });

    it('should reject when user is not the owner', async () => {
      authenticateUser();
      // getOrganizationService returns org owned by another user
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganizationOwnedByOther,
        error: null,
      });

      await expect(
        client.organizations.update({
          organizationId: mockOrganizationOwnedByOther.id,
          name: 'Updated',
        })
      ).rejects.toMatchObject({ code: 'FORBIDDEN' });
    });

    it('should update organization when user is owner', async () => {
      authenticateUser();
      const updated = { ...mockOrganization, name: 'Updated Org' };

      // getOrganizationService (ownership check)
      mockClient._queryBuilder.single
        .mockResolvedValueOnce({ data: mockOrganization, error: null })
        // actual update
        .mockResolvedValueOnce({ data: updated, error: null });

      const result = await client.organizations.update({
        organizationId: mockOrganization.id,
        name: 'Updated Org',
      });

      expect(result.name).toBe('Updated Org');
    });

    it('should reject name exceeding 100 characters', async () => {
      authenticateUser();

      await expect(
        client.organizations.update({
          organizationId: 'org-123',
          name: 'a'.repeat(101),
        })
      ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    });
  });

  describe('organizations.delete', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(
        client.organizations.delete({ organizationId: 'org-123' })
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });

    it('should reject when user is not the owner', async () => {
      authenticateUser();
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganizationOwnedByOther,
        error: null,
      });

      await expect(
        client.organizations.delete({
          organizationId: mockOrganizationOwnedByOther.id,
        })
      ).rejects.toMatchObject({ code: 'FORBIDDEN' });
    });

    it('should delete organization when user is owner', async () => {
      authenticateUser();
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganization,
        error: null,
      });

      const result = await client.organizations.delete({
        organizationId: mockOrganization.id,
      });

      expect(result).toBe(true);
    });
  });

  describe('organizations.getLogoSignedUploadUrl', () => {
    it('should reject unauthenticated requests', async () => {
      unauthenticateUser();

      await expect(
        client.organizations.getLogoSignedUploadUrl({
          organizationId: 'org-123',
        })
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });

    it('should return signed URL when user is owner', async () => {
      const signedUrlData = {
        signedUrl: 'https://example.com/upload',
        token: 'upload-token',
        path: 'organizations/logos/org-uuid-123-123456.webp',
      };

      // getOrganizationService
      mockClient._queryBuilder.single.mockResolvedValueOnce({
        data: mockOrganization,
        error: null,
      });
      authenticateUser();
      mockAdminClient._storageBucket.createSignedUploadUrl.mockResolvedValue({
        data: signedUrlData,
        error: null,
      });

      const result = await client.organizations.getLogoSignedUploadUrl({
        organizationId: mockOrganization.id,
      });

      expect(result).toEqual(signedUrlData);
    });
  });
});
