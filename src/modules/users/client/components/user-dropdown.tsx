'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { LogoutButton } from '@/modules/auth/client/components/logout-button';
import { useGetUserQuery } from '@/modules/users/client/hooks/use-get-user-query';
import { ChevronsUpDown, CreditCard, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';

export function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2 sm:gap-3 sm:p-3">
      <Skeleton className="size-7 rounded-full sm:size-8" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>

      <Skeleton className="size-4 shrink-0" />
    </div>
  );
}

export function UserDropdown() {
  const { data: user } = useGetUserQuery();

  if (!user) {
    return <UserProfileSkeleton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent sm:gap-3 sm:p-3">
          <Avatar className="size-7 sm:size-8">
            <AvatarImage src="#" />

            <AvatarFallback className="text-xs">
              {user.firstName.charAt(0) + user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold sm:text-sm">
              {user.firstName} {user.lastName}
            </p>

            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
              {user.email}
            </p>
          </div>

          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem>
          <CreditCard className="mr-2 size-4" />
          Billing
        </DropdownMenuItem>

        <Link href="/users/settings">
          <DropdownMenuItem className="cursor-pointer">
            <UserCircle className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer p-0">
          <LogoutButton
            variant="link"
            className="w-full cursor-pointer justify-start text-destructive no-underline hover:no-underline"
          >
            <LogOut className="mr-2 size-4 text-destructive" />
            Log Out
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
