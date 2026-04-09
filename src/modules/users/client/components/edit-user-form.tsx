'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { onFormError } from '@/lib/orpc/react-hook-form-error-handler';
import { cn } from '@/lib/shadcn/utils';
import { UserFormFields } from '@/modules/users/client/components/user-form-fields';
import {
  type UserFormValues,
  userFormSchema,
} from '@/modules/users/client/components/user-form.schema';
import { useGetUserQuery } from '@/modules/users/client/hooks/use-get-user-query';
import { useUpdateUserMutation } from '@/modules/users/client/hooks/use-update-user-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { type ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { EditUserSkeleton } from './edit-user-skeleton';

export type EditUserFormProps = ComponentPropsWithoutRef<'div'>;

export function EditUserForm({ className, ...props }: EditUserFormProps) {
  const router = useRouter();
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] =
    useState(false);

  const { data: user, isLoading } = useGetUserQuery();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, form]);

  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUserMutation();

  const onSubmit = async (data: UserFormValues) => {
    try {
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });

      if (data.email !== user?.email) {
        setShowEmailVerificationDialog(true);
      } else {
        toast.success('Profile updated successfully');
      }

      router.refresh();
    } catch (error) {
      toast.error('Failed to update profile');
      onFormError(error, form);
    }
  };

  if (isLoading) {
    return <EditUserSkeleton className={className} {...props} />;
  }

  if (!user) {
    return (
      <div className={cn('p-4 text-center text-muted-foreground', className)}>
        User not found.
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-2xl font-semibold tracking-tight">Edit Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal details below.
        </p>
      </div>

      <form id="edit-user-form" onSubmit={form.handleSubmit(onSubmit)}>
        <UserFormFields control={form.control} />
      </form>

      <Button
        type="submit"
        form="edit-user-form"
        className="w-full"
        disabled={isUpdatingUser}
      >
        {isUpdatingUser ? 'Updating...' : 'Update Profile'}
      </Button>

      <Dialog
        open={showEmailVerificationDialog}
        onOpenChange={setShowEmailVerificationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify your email address</DialogTitle>
            <DialogDescription>
              You&apos;ve updated your email address. For security reasons, you
              need to verify this change in <strong>BOTH</strong> your old and
              new email inboxes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowEmailVerificationDialog(false)}>
              Okay, I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
