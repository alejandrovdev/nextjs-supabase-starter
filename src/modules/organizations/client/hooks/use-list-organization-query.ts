'use client';

import { orpc } from '@/lib/orpc/orpc';
import { useQuery } from '@tanstack/react-query';

export const useListOrganizationsQuery = () => {
  const query = useQuery({
    ...orpc.organizations.list.queryOptions({
      queryKey: ['organizations'],
      input: {},
    }),
  });

  return query;
};
