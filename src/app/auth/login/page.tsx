import { createServerClient } from '@/lib/supabase/server';
import { LoginForm } from '@/modules/auth/client/components/login-form';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || data?.claims) {
    redirect('/');
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
