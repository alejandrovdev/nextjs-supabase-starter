import { createServerClient } from '@/lib/supabase/server';
import type {
  GetUserOutput,
  UpdateUserInput,
  UpdateUserOutput,
} from '@/modules/users/shared/users.types';
import { STATUS_CODES } from '@/utils/status-codes';
import { ORPCError } from '@orpc/server';

const DEFAULT_SELECT_USER = `
  id,
  firstName:first_name,
  lastName:last_name,
  createdAt:created_at,
  updatedAt:updated_at
`;

export const getUserService = async (): Promise<GetUserOutput> => {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('users')
    .select(DEFAULT_SELECT_USER)
    /**
     * * User is validated by protectedProcedure
     */
    .eq('id', user!.id)
    .single();

  if (error || !data) {
    console.error('getUserService Error:', error);
    throw error;
  }

  return {
    ...data,
    email: user!.email!,
  };
};

export const updateUserService = async (
  input: UpdateUserInput
): Promise<UpdateUserOutput> => {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ORPCError(STATUS_CODES[401]);
  }

  const attributes: {
    email?: string;
    data?: {
      first_name?: string;
      last_name?: string;
    };
  } = {};

  if (input.email) {
    attributes.email = input.email;
  }

  const options: {
    emailRedirectTo?: string;
  } = {};

  if (input.email && process.env.NEXT_PUBLIC_APP_URL) {
    options.emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/?email_verified=true`;
  }

  if (input.firstName || input.lastName) {
    attributes.data = {};
    if (input.firstName) attributes.data.first_name = input.firstName;
    if (input.lastName) attributes.data.last_name = input.lastName;
  }

  if (Object.keys(attributes).length > 0) {
    const { error: updateError } = await supabase.auth.updateUser(
      attributes,
      options
    );

    if (updateError) {
      console.error('updateUserService Auth Error:', updateError);
      throw updateError;
    }
  }

  return getUserService();
};
