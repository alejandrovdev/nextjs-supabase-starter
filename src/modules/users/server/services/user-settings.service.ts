import { createServerClient } from '@/lib/supabase/server';
import type {
  GetUserSettingsOutput,
  UpdateUserSettingsInput,
  UpdateUserSettingsOutput,
} from '@/modules/users/shared/user-settings.types';

const DEFAULT_TABLE = 'user_settings';

const DEFAULT_SELECT = `
  defaultOrganizationId:default_organization_id
`;

export const getUserSettingsService =
  async (): Promise<GetUserSettingsOutput> => {
    const supabase = await createServerClient();

    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from(DEFAULT_TABLE)
      .select(DEFAULT_SELECT)
      /**
       * * User is validated by protectedProcedure
       */
      .eq('user_id', user!.user!.id)
      .single();

    if (error || !data) {
      console.error('getUserSettingsService Error:', error);
      throw error;
    }

    return data;
  };

export const updateUserSettingsService = async (
  input: UpdateUserSettingsInput
): Promise<UpdateUserSettingsOutput> => {
  const supabase = await createServerClient();

  const { data: user } = await supabase.auth.getUser();

  const updates: {
    default_organization_id?: string | null;
  } = {};

  if (input.defaultOrganizationId !== undefined) {
    updates.default_organization_id = input.defaultOrganizationId;
  }

  if (Object.keys(updates).length === 0) {
    return getUserSettingsService();
  }

  const { data, error } = await supabase
    .from(DEFAULT_TABLE)
    .update(updates)
    /**
     * * User is validated by protectedProcedure
     */
    .eq('user_id', user!.user!.id)
    .select(DEFAULT_SELECT)
    .single();

  if (error || !data) {
    console.error('updateUserSettingsService Error:', error);
    throw error;
  }

  return data;
};
