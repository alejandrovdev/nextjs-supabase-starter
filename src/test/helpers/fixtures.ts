export const mockUser = {
  id: 'user-uuid-123',
  email: 'test@example.com',
  user_metadata: { first_name: 'John', last_name: 'Doe' },
};

export const mockOtherUser = {
  id: 'other-user-uuid-456',
  email: 'other@example.com',
  user_metadata: { first_name: 'Jane', last_name: 'Smith' },
};

export const mockOrganization = {
  id: 'org-uuid-123',
  name: 'Test Organization',
  description: 'A test organization',
  logoPath: null,
  ownerId: 'user-uuid-123',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockOrganizationWithLogo = {
  ...mockOrganization,
  id: 'org-uuid-456',
  logoPath: 'organizations/logos/org-uuid-456-1234567890.webp',
};

export const mockOrganizationOwnedByOther = {
  ...mockOrganization,
  id: 'org-uuid-789',
  ownerId: 'other-user-uuid-456',
};

export const mockUserProfile = {
  id: 'user-uuid-123',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const mockUserSettings = {
  defaultOrganizationId: 'org-uuid-123',
};
