'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

export type CreateOrganizationCardProps =
  React.ComponentPropsWithoutRef<'div'> & {
    onSuccess?: (organizationId: string) => void;
  };

export function CreateOrganizationCard({
  className,
  onSuccess,
  ...props
}: CreateOrganizationCardProps) {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Organization</CardTitle>

          <CardDescription>
            You need to create an organization to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="create-organization-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <OrganizationFormFields control={form.control} />
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="create-organization-form"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Creating...' : 'Create Organization'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
