import { queryClient } from '@/components/providers/query-provider';
import { orpc } from '@/lib/orpc/orpc';
import { useMutation } from '@tanstack/react-query';

export function useLogoutMutation() {
  const mutation = useMutation(
    orpc.auth.logout.mutationOptions({
      onSuccess: () => {
        queryClient.clear();
      },
      onError: (error) => {
        console.error(error);
      },
    })
  );

  return mutation;
}
