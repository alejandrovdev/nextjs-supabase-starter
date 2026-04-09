import {
  createOrganizationProcedure,
  deleteOrganizationProcedure,
  getLogoSignedUploadUrlProcedure,
  getOrganizationProcedure,
  listOrganizationsProcedure,
  updateOrganizationProcedure,
} from '@/modules/organizations/server/procedures/organizations.procedures';

export const organizationsRoutes = {
  organizations: {
    create: createOrganizationProcedure,
    get: getOrganizationProcedure,
    list: listOrganizationsProcedure,
    update: updateOrganizationProcedure,
    delete: deleteOrganizationProcedure,
    getLogoSignedUploadUrl: getLogoSignedUploadUrlProcedure,
  },
};
