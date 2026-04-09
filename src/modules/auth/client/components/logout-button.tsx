'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { ORPCError } from '@orpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLogoutMutation } from '../hooks/use-logout-mutation';

export function LogoutButton({ ...props }: ButtonProps) {
  const router = useRouter();

  const { mutateAsync: logout } = useLogoutMutation();

  const handleLogout = async () => {
    await logout(
      {},
      {
        onSuccess: () => {
          router.push('/auth/login');
          toast.success('Logged out successfully');
        },
        onError: (error) => {
          if (error instanceof ORPCError) {
            toast.error(error.message);
          } else {
            toast.error('Failed to logout');
          }
        },
      }
    );
  };

  return (
    <Button onClick={handleLogout} {...props}>
      {props.children || 'Logout'}
    </Button>
  );
}
