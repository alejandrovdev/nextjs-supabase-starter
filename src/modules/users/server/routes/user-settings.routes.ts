import {
  getUserSettingsProcedure,
  updateUserSettingsProcedure,
} from '@/modules/users/server/procedures/user-settings.procedures';

export const userSettingsRoutes = {
  userSettings: {
    get: getUserSettingsProcedure,
    update: updateUserSettingsProcedure,
  },
};
