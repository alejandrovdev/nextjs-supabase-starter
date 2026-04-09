'use client';

import { useCreateOrganizationMutation } from '@/modules/organizations/client/hooks/use-create-organization-mutation';
import { useUpdateOrganizationLogo } from '@/modules/organizations/client/hooks/use-update-organization-logo';
import { useUpdateUserSettingsMutation } from '@/modules/users/client/hooks/use-update-user-settings-mutation';

export function useCreateOrganization() {
  const {
    mutateAsync: createOrganizationMutation,
    isPending: isCreatingOrganization,
  } = useCreateOrganizationMutation();

  const { uploadLogo, isUploading } = useUpdateOrganizationLogo();

  const { mutateAsync: updateUserSettings, isPending: isUpdatingUserSettings } =
    useUpdateUserSettingsMutation();

  const createOrganization = async (
    data: {
      name: string;
      description?: string;
      logo?: File | null;
    },
    options?: {
      onSuccess?: (organizationId: string) => void;
      onError?: (error: unknown) => void;
    }
  ) => {
    const organization = await createOrganizationMutation({
      name: data.name,
      description: data.description,
    });

    if (data.logo) {
      await uploadLogo({
        organizationId: organization.id,
        file: data.logo,
      });
    }

    await updateUserSettings({
      defaultOrganizationId: organization.id,
    });

    options?.onSuccess?.(organization.id);

    return organization;
  };

  return {
    createOrganization,
    isPending: isCreatingOrganization || isUploading || isUpdatingUserSettings,
  };
}
