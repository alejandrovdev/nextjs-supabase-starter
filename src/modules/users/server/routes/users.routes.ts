import {
  getUserProcedure,
  updateUserProcedure,
} from '@/modules/users/server/procedures/users.procedures';

export const usersRoutes = {
  users: {
    get: getUserProcedure,
    update: updateUserProcedure,
  },
};
