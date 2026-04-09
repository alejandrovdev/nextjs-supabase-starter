'use client';

import { Button } from '@/components/ui/button';
import { onFormError } from '@/lib/orpc/react-hook-form-error-handler';
import { cn } from '@/lib/shadcn/utils';
import { useCreateOrganization } from '@/modules/organizations/client/hooks/use-create-organization';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { OrganizationFormFields } from './organization-form-fields';
import {
  type OrganizationFormValues,
  organizationFormSchema,
} from './organization-form.schema';

export type CreateOrganizationModalProps =
  React.ComponentPropsWithoutRef<'div'> & {
    onSuccess?: (organizationId: string) => void;
  };

export function CreateOrganizationModal({
  className,
  onSuccess,
  ...props
}: CreateOrganizationModalProps) {
  const router = useRouter();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: undefined,
    },
  });

  const { createOrganization, isPending } = useCreateOrganization();

  const onSubmit = async (data: OrganizationFormValues) => {
    await createOrganization(
      {
        name: data.name,
        description: data.description,
        logo: data.logo,
      },
      {
        onSuccess: (organizationId) => {
          toast.success('Organization created successfully');

          if (onSuccess) {
            onSuccess(organizationId);
          } else {
            router.push('/');
          }
        },
        onError: (error) => {
          toast.error('Failed to create organization');
          onFormError(error, form);
        },
      }
    );
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form
        id="create-organization-modal-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <OrganizationFormFields control={form.control} />
      </form>

      <Button
        type="submit"
        form="create-organization-modal-form"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? 'Creating...' : 'Create Organization'}
      </Button>
    </div>
  );
}
