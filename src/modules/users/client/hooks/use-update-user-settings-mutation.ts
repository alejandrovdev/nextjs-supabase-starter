'use client';

import { queryClient } from '@/components/providers/query-provider';
import { orpc } from '@/lib/orpc/orpc';
import { useMutation } from '@tanstack/react-query';

export function useUpdateUserSettingsMutation() {
  const mutation = useMutation(
    orpc.userSettings.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['user-settings'],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    })
  );

  return mutation;
}
