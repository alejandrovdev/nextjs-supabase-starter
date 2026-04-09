'use client';

import { orpc } from '@/lib/orpc/orpc';
import { useMutation } from '@tanstack/react-query';

export const useUpdateOrganizationLogoMutation = () => {
  const mutation = useMutation(
    orpc.organizations.getLogoSignedUploadUrl.mutationOptions()
  );

  return mutation;
};
