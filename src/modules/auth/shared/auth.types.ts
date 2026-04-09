import {
  forgotPasswordSchema,
  loginWithEmailSchema,
  signUpWithEmailSchema,
  updatePasswordSchema,
} from '@/modules/auth/shared/auth.schemas';
import z from 'zod';

export type SignUpWithEmailInput = z.infer<typeof signUpWithEmailSchema>;
export type LoginWithEmailInput = z.infer<typeof loginWithEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
