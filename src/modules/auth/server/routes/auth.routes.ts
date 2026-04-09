import {
  forgotPasswordProcedure,
  loginWithEmailProcedure,
  logoutProcedure,
  signUpWithEmailProcedure,
  updatePasswordProcedure,
} from '@/modules/auth/server/procedures/auth.procedures';

export const authRoutes = {
  auth: {
    signUpWithEmail: signUpWithEmailProcedure,
    loginWithEmail: loginWithEmailProcedure,
    forgotPassword: forgotPasswordProcedure,
    updatePassword: updatePasswordProcedure,
    logout: logoutProcedure,
  },
};
