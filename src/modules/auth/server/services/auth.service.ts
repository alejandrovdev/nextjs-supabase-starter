import { createServerClient } from '@/lib/supabase/server';
import type {
  ForgotPasswordInput,
  LoginWithEmailInput,
  SignUpWithEmailInput,
  UpdatePasswordInput,
} from '@/modules/auth/shared/auth.types';

export const signUpWithEmailService = async (
  input: SignUpWithEmailInput
): Promise<boolean> => {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
      },
    },
  });

  if (error) {
    console.error('signUpWithEmailService', error);
    throw error;
  }

  return true;
};

export const loginWithEmailService = async (
  input: LoginWithEmailInput
): Promise<boolean> => {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    console.error('loginWithEmailService', error);
    throw error;
  }

  return true;
};

export const forgotPasswordService = async (
  input: ForgotPasswordInput
): Promise<boolean> => {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
  });

  if (error) {
    console.error('forgotPasswordService', error);
    throw error;
  }

  return true;
};

export const updatePasswordService = async (
  input: UpdatePasswordInput
): Promise<boolean> => {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.updateUser({
    password: input.password,
  });

  if (error) {
    console.error('updatePasswordService', error);
    throw error;
  }

  return true;
};

export const logoutService = async (): Promise<boolean> => {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('logoutService', error);
    throw error;
  }

  return true;
};
