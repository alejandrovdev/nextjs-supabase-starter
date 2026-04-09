import { client } from '@/lib/orpc/orpc';
import { EditOrganizationForm } from '@/modules/organizations/client/components/edit-organization-form';

export default async function OrganizationSettingsPage() {
  const userSettings = await client.userSettings.get({});
  const organizationId = userSettings?.defaultOrganizationId;

  return (
    <div className="container mx-auto max-w-2xl p-10">
      {organizationId && (
        <EditOrganizationForm organizationId={organizationId} />
      )}
    </div>
  );
}
