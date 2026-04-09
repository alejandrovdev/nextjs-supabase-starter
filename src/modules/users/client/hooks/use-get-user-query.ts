'use client';

import { orpc } from '@/lib/orpc/orpc';
import { useQuery } from '@tanstack/react-query';

export const useGetUserQuery = () => {
  const query = useQuery({
    ...orpc.users.get.queryOptions({
      queryKey: ['user'],
      input: {},
    }),
  });

  return query;
};
