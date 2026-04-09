import { client } from '@/lib/orpc/orpc';
import { createServerClient } from '@/lib/supabase/server';
import { OrganizationSelectionList } from '@/modules/organizations/client/components/organization-selection-list';
import { redirect } from 'next/navigation';

async function OrganizationsPage() {
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

  if (userSettings.defaultOrganizationId) {
    redirect('/');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <OrganizationSelectionList organizations={organizations} />
    </div>
  );
}

export default OrganizationsPage;
