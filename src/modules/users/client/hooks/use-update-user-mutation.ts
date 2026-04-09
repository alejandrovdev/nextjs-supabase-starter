'use client';

import { queryClient } from '@/components/providers/query-provider';
import { orpc } from '@/lib/orpc/orpc';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUserMutation = () => {
  return useMutation(
    orpc.users.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['user'],
        });
      },
    })
  );
};
