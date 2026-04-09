import { SidebarProvider } from '@/components/ui/sidebar';
import { client } from '@/lib/orpc/orpc';
import { createServerClient } from '@/lib/supabase/server';
import { DashboardHeader } from '@/modules/dashboard/client/components/header';
import { DashboardSidebar } from '@/modules/dashboard/client/components/sidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const organizations = await client.organizations.list({});

  if (organizations.length === 0) {
    redirect('/organizations/new');
  }

  const userSettings = await client.userSettings.get({});

  if (!userSettings.defaultOrganizationId) {
    redirect('/organizations');
  }

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />

      <div className="h-svh w-full overflow-hidden lg:p-2">
        <div className="bg-container flex h-full w-full flex-col items-center justify-start overflow-hidden bg-background lg:rounded-md lg:border">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
