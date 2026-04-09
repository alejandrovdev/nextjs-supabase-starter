'use client';

import { queryClient } from '@/components/providers/query-provider';
import { orpc } from '@/lib/orpc/orpc';
import { useMutation } from '@tanstack/react-query';

export function useCreateOrganizationMutation() {
  const mutation = useMutation(
    orpc.organizations.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['organizations'],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    })
  );

  return mutation;
}
