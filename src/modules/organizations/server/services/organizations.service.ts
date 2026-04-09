import { createAdminClient, createServerClient } from '@/lib/supabase/server';
import type {
  CreateOrganizationInput,
  CreateOrganizationOutput,
  DeleteOrganizationInput,
  DeleteOrganizationOutput,
  GetLogoSignedUploadUrlInput,
  GetLogoSignedUploadUrlOutput,
  GetOrganizationInput,
  GetOrganizationOutput,
  ListOrganizationsOutput,
  UpdateOrganizationInput,
  UpdateOrganizationOutput,
} from '@/modules/organizations/shared/organizations.types';
import { DEFAULT_PUBLIC_BUCKET } from '@/shared/constants';
import { STATUS_CODES } from '@/utils/status-codes';
import { ORPCError } from '@orpc/server';

const ORGANIZATIONS_TABLE = 'organizations';

const DEFAULT_SELECT = `
  id,
  name,
  description,
  logoPath:logo_path,
  ownerId:owner_id,
  createdAt:created_at,
  updatedAt:updated_at
`;

export const createOrganizationService = async (
  input: CreateOrganizationInput
): Promise<CreateOrganizationOutput> => {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ORPCError(STATUS_CODES[401]);
  }

  const { data, error } = await supabase
    .from(ORGANIZATIONS_TABLE)
    .insert({
      name: input.name,
      description: input.description,
      logo_path: input.logoPath,
      owner_id: user.id,
    })
    .select(DEFAULT_SELECT)
    .single();

  if (error || !data) {
    console.error('createOrganizationService Error:', error);
    throw error;
  }

  return data;
};

export const getOrganizationService = async (
  input: GetOrganizationInput
): Promise<GetOrganizationOutput> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from(ORGANIZATIONS_TABLE)
    .select(DEFAULT_SELECT)
    .eq('id', input.organizationId)
    .single();

  if (error) {
    console.error('getOrganizationService Error:', error);
    throw error;
  }

  if (!data) {
    throw new ORPCError(STATUS_CODES[404], {
      message: 'Organization not found',
    });
  }

  return data;
};

export const listOrganizationsService =
  async (): Promise<ListOrganizationsOutput> => {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from(ORGANIZATIONS_TABLE)
      .select(DEFAULT_SELECT);

    if (error || !data) {
      console.error('listOrganizationsService Error:', error);
      throw error;
    }

    return data;
  };

export const updateOrganizationService = async (
  input: UpdateOrganizationInput
): Promise<UpdateOrganizationOutput> => {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ORPCError(STATUS_CODES[401]);
  }

  const organization = await getOrganizationService({
    organizationId: input.organizationId,
  });

  if (organization.ownerId !== user.id) {
    throw new ORPCError(STATUS_CODES[403], {
      message: 'You are not authorized to update this organization',
    });
  }

  const updates: {
    name?: string;
    description?: string | null;
    logo_path?: string | null;
    updated_at?: string;
  } = {};

  if (input.name !== undefined) {
    updates.name = input.name;
  }

  if (input.description !== undefined) {
    updates.description = input.description;
  }

  if (input.logoPath !== undefined) {
    updates.logo_path = input.logoPath;

    if (organization.logoPath && input.logoPath !== organization.logoPath) {
      const supabaseAdmin = createAdminClient();

      const { error: storageError } = await supabaseAdmin.storage
        .from(DEFAULT_PUBLIC_BUCKET)
        .remove([organization.logoPath]);

      if (storageError) {
        console.error('updateOrganizationService Storage Error:', storageError);
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return getOrganizationService({
      organizationId: input.organizationId,
    });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from(ORGANIZATIONS_TABLE)
    .update(updates)
    .eq('id', input.organizationId)
    .select(DEFAULT_SELECT)
    .single();

  if (error || !data) {
    console.error('updateOrganizationService Error:', error);
    throw error;
  }

  return data;
};

export const deleteOrganizationService = async (
  input: DeleteOrganizationInput
): Promise<DeleteOrganizationOutput> => {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ORPCError(STATUS_CODES[401]);
  }

  const organization = await getOrganizationService({
    organizationId: input.organizationId,
  });

  if (organization.ownerId !== user.id) {
    throw new ORPCError(STATUS_CODES[403], {
      message: 'You are not authorized to delete this organization',
    });
  }

  const { error } = await supabase
    .from(ORGANIZATIONS_TABLE)
    .delete()
    .eq('id', input.organizationId);

  if (error) {
    console.error('deleteOrganizationService Error:', error);
    throw error;
  }

  return true;
};

export const getLogoSignedUploadUrlService = async (
  input: GetLogoSignedUploadUrlInput
): Promise<GetLogoSignedUploadUrlOutput> => {
  /**
   * * Verify if the user is the owner of the organization
   * * Throw error if organization not found
   */
  const organization = await getOrganizationService({
    organizationId: input.organizationId,
  });

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ORPCError(STATUS_CODES[401]);
  }

  if (organization.ownerId !== user.id) {
    throw new ORPCError(STATUS_CODES[403], {
      message: 'You are not authorized to upload a logo for this organization',
    });
  }

  const supabaseAdmin = createAdminClient();
  const path = `organizations/logos/${input.organizationId}-${Date.now()}.webp`;

  const { data, error } = await supabaseAdmin.storage
    .from(DEFAULT_PUBLIC_BUCKET)
    .createSignedUploadUrl(path, {
      upsert: true,
    });

  if (error || !data) {
    console.error('getLogoSignedUploadUrlService Error:', error);
    throw error;
  }

  return data;
};
