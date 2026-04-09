import { Button } from '@/components/ui/button';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { env } from '@/lib/env';
import { UserDropdown } from '@/modules/users/client/components/user-dropdown';
import { Globe, HelpCircle, Settings } from 'lucide-react';
import Link from 'next/link';

export function DashboardSidebarFooter() {
  return (
    <SidebarFooter className="px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="h-9 sm:h-[38px]">
            <Link href="#">
              <HelpCircle className="size-4 sm:size-5" />

              <span className="text-sm">Help Center</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild className="h-9 sm:h-[38px]">
            <Link href="/organizations/settings">
              <Settings className="size-4 sm:size-5" />

              <span className="text-sm">Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <Button variant="outline" className="mt-2 w-full" asChild>
        <Link
          href={env.NEXT_PUBLIC_APP_URL as '/'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe className="size-4" />
          {env.NEXT_PUBLIC_APP_NAME}
        </Link>
      </Button>

      <UserDropdown />
    </SidebarFooter>
  );
}
