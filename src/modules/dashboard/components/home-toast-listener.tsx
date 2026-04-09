'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

function HomeToastListenerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (searchParams.get('email_verified') === 'true') {
      timerId = setTimeout(() => {
        toast.success('Email verified successfully');
        router.replace('/');
      });
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [searchParams, router]);

  return null;
}

export function HomeToastListener() {
  return <HomeToastListenerContent />;
}
