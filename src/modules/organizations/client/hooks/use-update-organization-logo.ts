'use client';

import { createClient } from '@/lib/supabase/client';
import { useUpdateOrganizationLogoMutation } from '@/modules/organizations/client/hooks/use-update-organization-logo-mutation';
import { useUpdateOrganizationMutation } from '@/modules/organizations/client/hooks/use-update-organization-mutation';
import { convertToWebP } from '@/utils/image-to-webp';

export function useUpdateOrganizationLogo() {
  const {
    mutateAsync: getLogoSignedUploadUrl,
    isPending: logoSignedUploadUrlPending,
  } = useUpdateOrganizationLogoMutation();

  const { mutateAsync: updateOrganization, isPending: organizationPending } =
    useUpdateOrganizationMutation();

  const uploadLogo = async ({
    organizationId,
    file,
    update = true,
  }: {
    organizationId: string;
    file: File;
    update?: boolean;
  }) => {
    let fileToUpload = file;

    if (file.type !== 'image/webp') {
      fileToUpload = await convertToWebP(file);
    }

    const { token, path } = await getLogoSignedUploadUrl({
      organizationId,
    });

    const supabase = createClient();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('public')
      .uploadToSignedUrl(path, token, fileToUpload, {
        contentType: 'image/webp',
      });

    if (uploadError) {
      throw uploadError;
    }

    if (update) {
      await updateOrganization({
        organizationId,
        logoPath: uploadData.path,
      });
    }

    return { path: uploadData.path };
  };

  return {
    uploadLogo,
    isUploading: logoSignedUploadUrlPending || organizationPending,
  };
}
