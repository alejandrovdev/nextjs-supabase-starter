import { createServerClient } from '@/lib/supabase/server';
import { SignUpForm } from '@/modules/auth/client/components/sign-up-form';
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
        <SignUpForm />
      </div>
    </div>
  );
}
