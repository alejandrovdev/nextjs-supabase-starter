import { authRoutes } from '@/modules/auth/server/routes/auth.routes';
import { organizationsRoutes } from '@/modules/organizations/server/routes/organizations.routes';
import { userSettingsRoutes } from '@/modules/users/server/routes/user-settings.routes';
import { usersRoutes } from '@/modules/users/server/routes/users.routes';

export const router = {
  ...authRoutes,
  ...organizationsRoutes,
  ...usersRoutes,
  ...userSettingsRoutes,
};

export type Router = typeof router;
