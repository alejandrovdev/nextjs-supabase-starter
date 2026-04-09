'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { onFormError } from '@/lib/orpc/react-hook-form-error-handler';
import { cn } from '@/lib/shadcn/utils';
import { createClient } from '@/lib/supabase/client';
import { useDeleteOrganizationMutation } from '@/modules/organizations/client/hooks/use-delete-organization-mutation';
import { useGetOrganizationQuery } from '@/modules/organizations/client/hooks/use-get-organization-query';
import { useUpdateOrganizationLogo } from '@/modules/organizations/client/hooks/use-update-organization-logo';
import { useUpdateOrganizationMutation } from '@/modules/organizations/client/hooks/use-update-organization-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { EditOrganizationSkeleton } from './edit-organization-skeleton';
import { OrganizationFormFields } from './organization-form-fields';
import {
  type OrganizationFormValues,
  organizationFormSchema,
} from './organization-form.schema';

export type EditOrganizationFormProps =
  React.ComponentPropsWithoutRef<'div'> & {
    onSuccess?: (organizationId: string) => void;
    organizationId: string;
    initialValues?: {
      name: string;
      description?: string | null;
    };
  };

export function EditOrganizationForm({
  className,
  onSuccess,
  initialValues,
  organizationId,
  ...props
}: EditOrganizationFormProps) {
  const router = useRouter();

  const { data: organization, isLoading } =
    useGetOrganizationQuery(organizationId);

  const formValues = initialValues
    ? {
        name: initialValues.name,
        description: initialValues.description ?? undefined,
        logo: undefined,
      }
    : organization
      ? {
          name: organization.name,
          description: organization.description ?? undefined,
          logo: undefined,
        }
      : undefined;

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: formValues || {
      name: '',
      description: undefined,
      logo: undefined,
    },
  });

  useEffect(() => {
    if (!initialValues && organization) {
      form.reset({
        name: organization.name,
        description: organization.description ?? undefined,
        logo: undefined,
      });
    }
  }, [organization, initialValues, form]);

  const { mutateAsync: updateOrganization, isPending: isUpdatingOrganization } =
    useUpdateOrganizationMutation();
  const { uploadLogo, isUploading: isUploadingLogo } =
    useUpdateOrganizationLogo();
  const { mutateAsync: deleteOrganization, isPending: isDeletingOrganization } =
    useDeleteOrganizationMutation();

  const isPending =
    isUpdatingOrganization || isUploadingLogo || isDeletingOrganization;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onDelete = async () => {
    try {
      await deleteOrganization({
        organizationId,
      });

      toast.success('Organization deleted successfully');
      setIsDeleteOpen(false);
      router.push('/organizations');
    } catch {
      toast.error('Failed to delete organization');
    }
  };

  const onSubmit = async (data: OrganizationFormValues) => {
    try {
      let logoPath: string | null | undefined =
        data.logo === null ? null : undefined;

      if (data.logo) {
        const { path } = await uploadLogo({
          organizationId,
          file: data.logo,
          update: false,
        });

        logoPath = path;
      }

      await updateOrganization({
        organizationId,
        name: data.name,
        description: data.description,
        logoPath,
      });

      toast.success('Organization updated successfully');

      if (onSuccess) {
        onSuccess(organizationId);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to update organization');
      onFormError(error, form);
    }
  };

  if (isLoading && !initialValues) {
    return <EditOrganizationSkeleton className={className} {...props} />;
  }

  if (!formValues) {
    return (
      <div className={cn('p-4 text-center text-muted-foreground', className)}>
        Organization not found.
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-2xl font-semibold tracking-tight">
          Edit Organization
        </h3>
        <p className="text-sm text-muted-foreground">
          Update your organization details below.
        </p>
      </div>

      <form id="edit-organization-form" onSubmit={form.handleSubmit(onSubmit)}>
        <OrganizationFormFields
          control={form.control}
          currentLogoUrl={
            organization?.logoPath
              ? createClient()
                  .storage.from('public')
                  .getPublicUrl(organization.logoPath).data.publicUrl
              : undefined
          }
        />
      </form>

      <Button
        type="submit"
        form="edit-organization-form"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? 'Updating...' : 'Update Organization'}
      </Button>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-destructive hover:text-destructive"
            disabled={isPending}
          >
            Delete Organization
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this organization? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletingOrganization}
            >
              {isDeletingOrganization ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
