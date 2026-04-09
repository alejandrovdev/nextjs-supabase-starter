import { client } from '@/lib/orpc/orpc';
import { createServerClient } from '@/lib/supabase/server';
import { CreateOrganizationCard } from '@/modules/organizations/client/components/create-organization-card';
import { redirect } from 'next/navigation';

export default async function SetupPage() {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const organizations = await client.organizations.list({});

  if (organizations.length > 0) {
    redirect('/');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-lg">
        <CreateOrganizationCard />
      </div>
    </div>
  );
}
