'use client';

import { queryClient } from '@/components/providers/query-provider';
import { orpc } from '@/lib/orpc/orpc';
import { useMutation } from '@tanstack/react-query';

export const useDeleteOrganizationMutation = () => {
  const mutation = useMutation(
    orpc.organizations.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['organizations'],
        });
      },
    })
  );

  return mutation;
};
