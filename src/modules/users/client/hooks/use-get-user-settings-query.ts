'use client';

import { orpc } from '@/lib/orpc/orpc';
import { useQuery } from '@tanstack/react-query';

export const useGetUserSettingsQuery = () => {
  const query = useQuery({
    ...orpc.userSettings.get.queryOptions({
      queryKey: ['user-settings'],
      input: {},
    }),
  });

  return query;
};
