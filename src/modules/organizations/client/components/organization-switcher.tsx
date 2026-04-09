'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { CreateOrganizationModal } from '@/modules/organizations/client/components/create-organization-modal';
import { useListOrganizationsQuery } from '@/modules/organizations/client/hooks/use-list-organization-query';
import { useGetUserSettingsQuery } from '@/modules/users/client/hooks/use-get-user-settings-query';
import { useUpdateUserSettingsMutation } from '@/modules/users/client/hooks/use-update-user-settings-mutation';
import { ChevronsUpDown, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function OrganizationSwitcherSkeleton() {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-lg border bg-card p-2 sm:mb-4 sm:gap-3 sm:p-3">
      <Skeleton className="size-8 rounded-lg sm:size-[34px]" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>

      <Skeleton className="size-4 shrink-0" />
    </div>
  );
}

export function OrganizationSwitcher() {
  const router = useRouter();
  const [showCreateOrganizationDialog, setShowCreateOrganizationDialog] =
    useState(false);

  const { data: settings, isPending: isSettingsPending } =
    useGetUserSettingsQuery();

  const { mutate: updateUserSettings } = useUpdateUserSettingsMutation();

  const { data: organizations, isPending: isOrganizationsPending } =
    useListOrganizationsQuery();

  if (isSettingsPending || isOrganizationsPending) {
    return <OrganizationSwitcherSkeleton />;
  }

  const selectedOrganization = organizations?.find(
    (organization) => organization.id === settings?.defaultOrganizationId
  );

  const getLogoUrl = (path: string | null | undefined) => {
    if (!path) return undefined;

    const supabase = createClient();
    const { data } = supabase.storage.from('public').getPublicUrl(path);

    return data.publicUrl;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="mb-3 flex cursor-pointer items-center gap-2 rounded-lg border bg-card p-2 transition-colors hover:bg-accent sm:mb-4 sm:gap-3 sm:p-3">
            <Avatar className="size-8 rounded-lg sm:size-[34px]">
              <AvatarImage
                src={getLogoUrl(selectedOrganization?.logoPath)}
                className="object-cover"
              />

              <AvatarFallback className="rounded-lg bg-linear-to-r from-[#06b6d4] to-[#3b82f6] text-white">
                {selectedOrganization?.name?.charAt(0) ?? 'O'}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold sm:text-sm">
                {selectedOrganization?.name ?? 'Select Organization'}
              </p>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="size-3 sm:size-3.5" />

                <span className="text-[10px] sm:text-xs">1 Member</span>
              </div>
            </div>

            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          align="start"
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Organizations
          </DropdownMenuLabel>

          <DropdownMenuGroup>
            {organizations?.map((organization) => (
              <DropdownMenuItem
                key={organization.id}
                className="cursor-pointer gap-2 p-2"
                onSelect={() =>
                  updateUserSettings(
                    { defaultOrganizationId: organization.id },
                    {
                      onSuccess: () => {
                        router.refresh();
                      },
                    }
                  )
                }
              >
                <Avatar className="size-6 rounded-sm border">
                  <AvatarImage
                    src={getLogoUrl(organization.logoPath)}
                    className="object-cover"
                  />

                  <AvatarFallback className="rounded-sm">
                    {organization.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {organization.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer gap-2 p-2"
            onSelect={() => setShowCreateOrganizationDialog(true)}
          >
            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus className="size-4" />
            </div>

            <div className="font-medium text-muted-foreground">
              Add Organization
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={showCreateOrganizationDialog}
        onOpenChange={setShowCreateOrganizationDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to manage your project and team members.
            </DialogDescription>
          </DialogHeader>
          <CreateOrganizationModal
            onSuccess={() => {
              setShowCreateOrganizationDialog(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
