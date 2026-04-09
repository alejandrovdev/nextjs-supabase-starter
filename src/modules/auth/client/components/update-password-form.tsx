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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { orpc } from '@/lib/orpc/orpc';
import { onFormError } from '@/lib/orpc/react-hook-form-error-handler';
import { cn } from '@/lib/shadcn/utils';
import { updatePasswordSchema } from '@/modules/auth/shared/auth.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const { mutate, isPending } = useMutation(
    orpc.auth.updatePassword.mutationOptions({
      onSuccess: () => {
        toast.success('Password updated successfully');
        router.push('/');
      },
      onError: (error) => {
        onFormError(error, form, 'Failed to update password');
      },
    })
  );

  const onSubmit = (data: UpdatePasswordValues) => {
    mutate(data);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="update-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-password-password">
                      New password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="update-password-password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                      placeholder="New password"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="update-password-form"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save new password'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
