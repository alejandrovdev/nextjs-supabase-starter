'use client';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { OrganizationSwitcher } from '@/modules/organizations/client/components/organization-switcher';
import { ChevronRight, LayoutGrid, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    href: '/',
  },
  {
    title: 'Contacts',
    icon: Users,
    href: '/contacts',
  },
];

export function DashboardSidebarContent() {
  const pathname = usePathname();

  return (
    <SidebarContent className="px-3 sm:px-4 lg:px-5">
      <OrganizationSwitcher />

      <SidebarGroup className="p-0">
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={item.href === pathname}
                  className="h-9 sm:h-[38px]"
                >
                  <Link href={item.href as '/'}>
                    <item.icon className="size-4 sm:size-5" />

                    <span className="text-sm">{item.title}</span>

                    {item.href === pathname && (
                      <ChevronRight className="ml-auto size-4 text-muted-foreground opacity-60" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
