'use client';

import { queryClient } from '@/components/providers/query-provider';
import { orpc } from '@/lib/orpc/orpc';
import { useMutation } from '@tanstack/react-query';

export const useUpdateOrganizationMutation = () => {
  const mutation = useMutation(
    orpc.organizations.update.mutationOptions({
      onSuccess: ({ id }) => {
        queryClient.invalidateQueries({
          queryKey: ['organization', id],
        });

        queryClient.invalidateQueries({
          queryKey: ['organizations'],
        });
      },
    })
  );

  return mutation;
};
