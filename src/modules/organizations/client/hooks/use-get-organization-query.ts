'use client';

import { orpc } from '@/lib/orpc/orpc';
import { useQuery } from '@tanstack/react-query';

export const useGetOrganizationQuery = (organizationId: string) => {
  const query = useQuery({
    ...orpc.organizations.get.queryOptions({
      queryKey: ['organization', organizationId],
      input: {
        organizationId,
      },
    }),
    enabled: !!organizationId,
  });

  return query;
};
