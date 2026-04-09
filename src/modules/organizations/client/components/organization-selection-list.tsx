'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import type { Organization } from '@/modules/organizations/shared/organizations.types';
import { useUpdateUserSettingsMutation } from '@/modules/users/client/hooks/use-update-user-settings-mutation';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface OrganizationSelectionListProps {
  organizations: Organization[];
}

export function OrganizationSelectionList({
  organizations,
}: OrganizationSelectionListProps) {
  const router = useRouter();
  const { mutateAsync: updateUserSettings } = useUpdateUserSettingsMutation();

  const getLogoUrl = (path: string | null | undefined) => {
    if (!path) return undefined;

    const supabase = createClient();
    const { data } = supabase.storage.from('public').getPublicUrl(path);

    return data.publicUrl;
  };

  const onSelect = async (organizationId: string) => {
    try {
      await updateUserSettings({
        defaultOrganizationId: organizationId,
      });

      router.push('/');
      router.refresh();
    } catch {
      toast.error('Failed to select organization');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="mb-2 rounded-full border bg-background p-3 shadow-xs">
          <Users className="size-6 text-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Select Organization
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Choose an organization to continue to your dashboard.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 *:w-full *:sm:w-[calc(50%-0.5rem)] *:lg:w-[calc((100%-2rem)/3)]">
        {organizations.map((organization) => (
          <Card
            key={organization.id}
            className="group flex h-full cursor-pointer flex-col justify-between transition-all duration-200 hover:border-primary/50 hover:shadow-md"
            onClick={() => onSelect(organization.id)}
          >
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 px-6">
              <Avatar className="size-10 shrink-0 rounded-md border">
                <AvatarImage
                  src={getLogoUrl(organization.logoPath)}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-md bg-linear-to-r from-[#06b6d4] to-[#3b82f6] text-xs font-semibold text-white">
                  {organization.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-1">
                <CardTitle className="truncate text-sm leading-tight font-semibold transition-colors group-hover:text-primary">
                  {organization.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                  {organization.description || 'No description available'}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="mt-auto px-6 pt-0">
              <div className="flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
                <Users className="size-3.5" />
                <span>5 Members</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
