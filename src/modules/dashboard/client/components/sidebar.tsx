'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { DashboardSidebarContent } from '@/modules/dashboard/client/components/sidebar-content';
import { DashboardSidebarFooter } from '@/modules/dashboard/client/components/sidebar-footer';
import { DashboardSidebarHeader } from '@/modules/dashboard/client/components/sidebar-header';
import type { ComponentProps } from 'react';

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
      <DashboardSidebarHeader />
      <DashboardSidebarContent />
      <DashboardSidebarFooter />
    </Sidebar>
  );
}
